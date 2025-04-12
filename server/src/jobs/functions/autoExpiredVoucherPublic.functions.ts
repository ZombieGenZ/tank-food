import databaseService from '~/services/database.services'
import { writeInfoLog } from '~/utils/log.utils'
import { formatDateFull2 } from '~/utils/date.utils'
import { serverLanguage } from '~/index'
import { LANGUAGE } from '~/constants/language.constants'
import { VoucherPublicStatusEnum } from '~/constants/voucher.constants'
import { notificationRealtime } from '~/utils/realtime.utils'
import { ObjectId } from 'mongodb'

export const autoExpiredVoucherPublic = async () => {
  const currentDate = new Date()
    const voucher = await databaseService.voucherPublic.find({ status: VoucherPublicStatusEnum.AVAILABLE }).toArray()

    const expiredVouchers = voucher.filter((item) => {
      return item.expiration_date.getTime() < currentDate.getTime()
    })

    const promises = [] as Promise<void>[]
    const promisesUser = [] as Promise<void>[]
    for (const item of expiredVouchers) {
      const users = await databaseService.users.find({ storage_voucher: { $in: [item._id] } }).toArray()

      for (const user of users) {
        promisesUser.push(
          new Promise((resolve, reject) => {
            try {
              notificationRealtime(`freshSync-user-${user._id}`, 'expired-public-voucher-storage', `voucher/public/${user._id}/expired`, item)
              resolve()
            } catch (err) {
              reject()
            }
          })
        )
      }

      promises.push(
        new Promise((resolve, reject) => {
          try {
            databaseService.voucherPublic.updateOne(
              {
                _id: item._id
              },
              {
                $set: {
                  status: VoucherPublicStatusEnum.UNAVAILABLE
                },
                $currentDate: {
                  updated_at: true
                }
              }
            )

            if (serverLanguage == LANGUAGE.VIETNAMESE) {
              console.log(
                `\x1b[33mĐã tự động vô hiệu hóa mã giảm giá \x1b[36m${item.code}\x1b[33m (ID: \x1b[36m${item._id}\x1b[33m) thành công\x1b[0m`
              )
              writeInfoLog(
                `Đã tự động vô hiệu hóa mã giảm giá ${item.code} (ID: ${item._id}) thành công (Time: ${formatDateFull2(currentDate)})`
              )
            } else {
              console.log(
                `\x1b[33mSuccessfully auto-disabled discount code \x1b[36m${item.code}\x1b[33m (ID: \x1b[36m${item._id}\x1b[33m)\x1b[0m`
              )
              writeInfoLog(
                `Successfully auto-disabled discount code ${item.code} (ID: ${item._id}) (Time: ${formatDateFull2(currentDate)})`
              )
            }
            resolve()
          } catch (err) {
            reject()
          }
        })
      )
    }
    await Promise.all([
      ...promises,
      ...promisesUser
    ])
}
