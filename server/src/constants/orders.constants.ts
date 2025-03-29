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
