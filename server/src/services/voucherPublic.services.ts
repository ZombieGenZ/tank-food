import { CreateVoucherRequestsBody } from '~/models/requests/voucherPublic.requests'
import databaseService from './database.services'
import VoucherPublic from '~/models/schemas/voucherPublic.schemas'

class VoucherPublicService {
  async create(payload: CreateVoucherRequestsBody) {
    await databaseService.voucherPublic.insertOne(
      new VoucherPublic({
        code: payload.code,
        discount: payload.discount,
        quantity: payload.quantity,
        expiration_date: new Date(payload.expiration_date),
        requirement: payload.requirement
      })
    )
  }
}

const voucherPublicService = new VoucherPublicService()
export default voucherPublicService
