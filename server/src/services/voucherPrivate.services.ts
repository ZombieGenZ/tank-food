import databaseService from './database.services'
import VoucherPrivate from '~/models/schemas/voucherPrivate.schemas'

class VoucherPrivateService {
  async useVoucher(voucher: VoucherPrivate) {
    databaseService.voucherPrivate.deleteOne({
      _id: voucher._id
    })
  }
}

const voucherPrivateService = new VoucherPrivateService()
export default voucherPrivateService
