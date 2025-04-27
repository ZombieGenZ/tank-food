// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { ObjectId } from 'mongodb'

interface PaymentHistoryType {
  _id?: ObjectId
  id: number
  gateway: string
  transactionDate: string
  accountNumber: string
  code: string | null
  content: string
  transferType: string
  transferAmount: number
  accumulated: number
  subAccount: number | null
  referenceCode: string
  description: string
}

export default class PaymentHistory {
  _id: ObjectId
  id: number
  gateway: string
  transactionDate: string
  accountNumber: string
  code: string | null
  content: string
  transferType: string
  transferAmount: number
  accumulated: number
  subAccount: number | null
  referenceCode: string
  description: string

  constructor(history: PaymentHistoryType) {
    this._id = history._id || new ObjectId()
    this.id = history.id
    this.gateway = history.gateway
    this.accountNumber = history.accountNumber
    this.transactionDate = history.transactionDate
    this.code = history.code
    this.content = history.content
    this.transferType = history.transferType
    this.transferAmount = history.transferAmount
    this.accumulated = history.accumulated
    this.subAccount = history.subAccount
    this.referenceCode = history.referenceCode
    this.description = history.description
  }
}
