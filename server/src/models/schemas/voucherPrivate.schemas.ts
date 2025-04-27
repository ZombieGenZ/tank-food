// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { ObjectId } from 'mongodb'
import { VoucherPrivateStatusEnum } from '~/constants/voucher.constants'

interface VoucherPrivateType {
  _id?: ObjectId
  code: string
  discount: number
  user: ObjectId
  status?: VoucherPrivateStatusEnum
  created_at?: Date
  updated_at?: Date
}

export default class VoucherPrivate {
  _id: ObjectId
  code: string
  discount: number
  user: ObjectId
  status: VoucherPrivateStatusEnum
  created_at: Date
  updated_at: Date

  constructor(voucher: VoucherPrivateType) {
    this._id = voucher._id || new ObjectId()
    this.code = voucher.code
    this.discount = voucher.discount
    this.user = voucher.user
    this.status = voucher.status || VoucherPrivateStatusEnum.UNUSED
    this.created_at = voucher.created_at || new Date()
    this.updated_at = voucher.updated_at || new Date()
  }
}
