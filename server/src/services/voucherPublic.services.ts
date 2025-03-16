import {
  CreateVoucherRequestsBody,
  UpdateVoucherRequestsBody,
  DeleteVoucherRequestsBody,
  FindVoucherRequestsBody
} from '~/models/requests/voucherPublic.requests'
import databaseService from './database.services'
import VoucherPublic from '~/models/schemas/voucherPublic.schemas'
import { ObjectId } from 'mongodb'
import { notificationRealtime } from '~/utils/realtime.utils'
import User from '~/models/schemas/users.schemas'

class VoucherPublicService {
  async create(payload: CreateVoucherRequestsBody, user: User) {
    const voucher_id = new ObjectId()
    const voucher = new VoucherPublic({
      _id: voucher_id,
      code: payload.code,
      discount: payload.discount,
      quantity: payload.quantity,
      expiration_date: new Date(payload.expiration_date),
      requirement: payload.requirement,
      created_by: user._id,
      updated_by: user._id
    })

    await Promise.all([
      databaseService.voucherPublic.insertOne(voucher),
      notificationRealtime('freshSync-admin', 'create-public-voucher', 'voucher/public/create', voucher)
    ])
  }
  async update(payload: UpdateVoucherRequestsBody, user: User) {
    const voucher_id = new ObjectId(payload.voucher_id)
    const voucher = {
      _id: voucher_id,
      code: payload.code,
      discount: payload.discount,
      quantity: payload.quantity,
      expiration_date: new Date(payload.expiration_date),
      requirement: payload.requirement,
      updated_by: user._id
    }

    await Promise.all([
      databaseService.voucherPublic.updateOne(
        {
          _id: voucher_id
        },
        {
          $set: {
            code: payload.code,
            quantity: payload.quantity,
            discount: payload.discount,
            requirement: payload.requirement,
            expiration_date: new Date(payload.expiration_date),
            updated_by: user._id
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      notificationRealtime('freshSync-admin', 'update-public-voucher', 'voucher/public/update', voucher)
    ])
  }
  async delete(payload: DeleteVoucherRequestsBody) {
    const data = {
      _id: new ObjectId(payload.voucher_id)
    }
    await Promise.all([
      databaseService.voucherPublic.deleteOne({
        _id: new ObjectId(payload.voucher_id)
      }),
      notificationRealtime('freshSync-admin', 'delete-public-voucher', 'voucher/public/delete', data)
    ])
  }
  async getVoucher() {
    const voucher = await databaseService.voucherPublic.find({}).toArray()
    return voucher
  }
  async findVoucher(payload: FindVoucherRequestsBody) {
    const voucher = await databaseService.voucherPublic.find({ $text: { $search: payload.keywords } }).toArray()
    return voucher
  }
}

const voucherPublicService = new VoucherPublicService()
export default voucherPublicService
