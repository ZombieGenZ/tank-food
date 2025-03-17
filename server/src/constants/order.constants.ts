import { ObjectId } from 'mongodb'

export interface ProductList {
  product_id: ObjectId
  quantity: number
  price?: number
}

export enum PaymentType {
  CASH,
  BANK
}

export enum PaymentStatus {
  PENDING,
  PAID,
  FAILED
}

export enum OrderStatus {
  PENDING,
  CONFIRMED,
  DELIVERING,
  DELIVERED,
  COMPLETED,
  CANCELED
}

// export enum OrderOnlineStatus {
//   PENDING,
//   CONFIRMED,
//   DELIVERING,
//   DELIVERED,
//   CANCELED
// }

// export enum OrderOfflineStatus {
//   PENDING,
//   CONFIRMED,
//   COMPLETED,
//   CANCELED
// }
