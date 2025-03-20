import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import VoucherPrivate from '~/models/schemas/voucherPrivate.schemas'
import User from '~/models/schemas/users.schemas'

class VoucherPrivateService {
  async getVoucher(user: User) {
    return await databaseService.voucherPrivate
      .find({
        user: user._id
      })
      .toArray()
  }
  async insertVoucher(code: string, discount: number, user: ObjectId) {
    await databaseService.voucherPrivate.insertOne(
      new VoucherPrivate({
        code,
        discount,
        user
      })
    )
  }
  async useVoucher(voucher: VoucherPrivate) {
    databaseService.voucherPrivate.deleteOne({
      _id: voucher._id
    })
  }
}

const voucherPrivateService = new VoucherPrivateService()
export default voucherPrivateService
