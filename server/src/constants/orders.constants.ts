// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { ObjectId } from 'mongodb'

export interface ProductList {
  product_id: ObjectId
  quantity: number
  price?: number
  data?: any
}

export enum DeliveryTypeEnum {
  COUNTER,
  DELIVERY
}

export enum PaymentTypeEnum {
  CASH,
  BANK
}

export enum PaymentStatusEnum {
  PENDING,
  PAID,
  FAILED
}

export enum OrderStatusEnum {
  PENDING,
  CONFIRMED,
  DELIVERING,
  DELIVERED,
  COMPLETED,
  CANCELED
}
