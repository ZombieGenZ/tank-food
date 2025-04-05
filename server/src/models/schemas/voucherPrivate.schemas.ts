import { ObjectId } from 'mongodb'
import { VoucherStatusEnum } from '~/constants/voucher.constants'

interface VoucherPrivateType {
  _id?: ObjectId
  code: string
  discount: number
  user: ObjectId
  status?: VoucherStatusEnum
  created_at?: Date
  updated_at?: Date
}

export default class VoucherPrivate {
  _id: ObjectId
  code: string
  discount: number
  user: ObjectId
  status: VoucherStatusEnum
  created_at: Date
  updated_at: Date

  constructor(voucher: VoucherPrivateType) {
    this._id = voucher._id || new ObjectId()
    this.code = voucher.code
    this.discount = voucher.discount
    this.user = voucher.user
    this.status = voucher.status || VoucherStatusEnum.UNUSED
    this.created_at = voucher.created_at || new Date()
    this.updated_at = voucher.updated_at || new Date()
  }
}
