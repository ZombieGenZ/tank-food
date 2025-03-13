import { ObjectId } from 'mongodb'

interface VoucherPrivateType {
  _id?: ObjectId
  code: string
  discount: number
  requirement: number
  user: ObjectId
  created_at?: Date
}

export default class VoucherPrivate {
  _id: ObjectId
  code: string
  discount: number
  requirement: number
  user: ObjectId
  created_at: Date
  constructor(voucher: VoucherPrivateType) {
    this._id = voucher._id || new ObjectId()
    this.code = voucher.code
    this.discount = voucher.discount
    this.requirement = voucher.requirement
    this.user = voucher.user
    this.created_at = voucher.created_at || new Date()
  }
}
