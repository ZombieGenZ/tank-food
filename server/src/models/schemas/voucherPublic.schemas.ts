import { ObjectId } from 'mongodb'
import { VoucherPublicStatusEnum } from '~/constants/voucher.constants'

interface VoucherPublicType {
  _id?: ObjectId
  code: string
  quantity: number
  expiration_date: Date
  discount: number
  requirement: number
  used?: number
  status?: VoucherPublicStatusEnum
  created_by: ObjectId
  updated_by: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class VoucherPublic {
  _id: ObjectId
  code: string
  quantity: number
  expiration_date: Date
  discount: number
  requirement: number
  used: number
  status: VoucherPublicStatusEnum
  created_by: ObjectId
  updated_by: ObjectId
  created_at: Date
  updated_at: Date

  constructor(voucher: VoucherPublicType) {
    const date = new Date()

    this._id = voucher._id || new ObjectId()
    this.code = voucher.code
    this.quantity = voucher.quantity
    this.expiration_date = voucher.expiration_date
    this.discount = voucher.discount
    this.requirement = voucher.requirement
    this.used = voucher.used || 0
    this.status = voucher.status || VoucherPublicStatusEnum.AVAILABLE
    this.created_by = voucher.created_by
    this.updated_by = voucher.updated_by
    this.created_at = voucher.created_at || date
    this.updated_at = voucher.updated_at || date
  }
}
