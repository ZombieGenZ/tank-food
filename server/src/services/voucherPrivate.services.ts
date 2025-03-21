import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import VoucherPrivate from '~/models/schemas/voucherPrivate.schemas'
import User from '~/models/schemas/users.schemas'
import { notificationRealtime } from '~/utils/realtime.utils'

class VoucherPrivateService {
  async getVoucher(user: User) {
    return await databaseService.voucherPrivate
      .find({
        user: user._id
      })
      .toArray()
  }
  async insertVoucher(code: string, discount: number, user: ObjectId) {
    const voucher_id = new ObjectId()
    const voucher = new VoucherPrivate({
      _id: voucher_id,
      code,
      discount,
      user
    })
    await Promise.all([
      databaseService.voucherPrivate.insertOne(voucher),
      notificationRealtime(`freshSync-user-${user}`, 'new-voucher-private', 'voucher/private/new', voucher)
    ])
  }
  async useVoucher(voucher: VoucherPrivate) {
    const data = {
      ...voucher,
      _id: voucher._id
    }
    await Promise.all([
      databaseService.voucherPrivate.deleteOne({
        _id: voucher._id
      }),
      notificationRealtime(`freshSync-user-${voucher.user}`, 'remove-voucher-private', 'voucher/private/remove', data)
    ])
  }
}

const voucherPrivateService = new VoucherPrivateService()
export default voucherPrivateService
