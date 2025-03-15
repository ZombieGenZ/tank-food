import { ObjectId } from 'mongodb'

export interface ProductList {
  product_id: ObjectId
  quantity: number
  price: number
}

export enum PaymentStatus {
  PENDING,
  PAID,
  FAILED
}

export enum OrderOnlineStatus {
  PENDING,
  CONFIRMED,
  DELIVERING,
  DELIVERED
}

export enum OrderOfflineStatus {
  PENDING,
  CONFIRMED,
  COMPLETED
}
