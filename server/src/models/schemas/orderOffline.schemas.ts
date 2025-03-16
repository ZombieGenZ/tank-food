import { ObjectId } from 'mongodb'
import { ProductList, PaymentStatus, OrderOfflineStatus } from '~/constants/order.constants'

interface OrderOfflineType {
  _id?: ObjectId
  product: ProductList | ProductList[]
  total_quantity: number
  total_price: number
  total_bill: number
  payment_status?: PaymentStatus
  order_status?: OrderOfflineStatus
  created_at?: Date
  updated_at?: Date
}

export default class OrderOffline {
  _id: ObjectId
  product: ProductList | ProductList[]
  total_quantity: number
  total_price: number
  total_bill: number
  payment_status: PaymentStatus
  order_status: OrderOfflineStatus
  created_at: Date
  updated_at: Date

  constructor(order: OrderOfflineType) {
    const date = new Date()

    this._id = order._id || new ObjectId()
    this.product = order.product
    this.total_quantity = order.total_quantity
    this.total_price = order.total_price
    this.total_bill = order.total_bill
    this.payment_status = order.payment_status || PaymentStatus.PENDING
    this.order_status = order.order_status || OrderOfflineStatus.PENDING
    this.created_at = order.created_at || date
    this.updated_at = order.updated_at || date
  }
}
