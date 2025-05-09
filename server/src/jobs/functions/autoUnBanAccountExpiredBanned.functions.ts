// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import databaseService from '~/services/database.services'
import AccountmManagementService from '~/services/accountManagement.services'
import { writeInfoLog } from '~/utils/log.utils'
import { formatDateFull2 } from '~/utils/date.utils'
import { serverLanguage } from '~/index'
import { LANGUAGE } from '~/constants/language.constants'

export const autoUnBanAccountExpiredBanned = async () => {
  const currentDate = new Date()
  const userBanned = await databaseService.users.find({ penalty: { $ne: null } }).toArray()

  const promises = [] as Promise<void>[]

  for (const user of userBanned) {
    if (user.penalty == null) {
      continue
    }

    if (user.penalty.expired_at <= currentDate) {
      promises.push(
        new Promise((resolve, reject) => {
          try {
            AccountmManagementService.unBan(user._id.toString())
            if (serverLanguage == LANGUAGE.VIETNAMESE) {
              console.log(
                `\x1b[33mĐã tự động mở khóa tài khoản \x1b[36m${user.display_name}\x1b[33m (ID: \x1b[36m${user._id}\x1b[33m) thành công\x1b[0m`
              )
              writeInfoLog(
                `Đã tự động mở khóa tài khoản ${user.display_name} (ID: ${user._id}) thành công (Time: ${formatDateFull2(currentDate)})`
              )
            } else {
              console.log(
                `\x1b[33mSuccessfully automatically unlocked account \x1b[36m${user.display_name}\x1b[33m (ID: \x1b[36m${user._id}\x1b[33m)\x1b[0m`
              )
              writeInfoLog(
                `Successfully automatically unlocked account ${user.display_name} (ID: ${user._id}) (Time: ${formatDateFull2(currentDate)})`
              )
            }
            resolve()
          } catch (err) {
            reject()
          }
        })
      )
    }
  }

  await Promise.all(promises)
}
