import { ObjectId } from 'mongodb'
import { ProductList, PaymentStatus, OrderOnlineStatus } from '~/constants/order.constants'

interface OrderOnlineType {
  _id?: ObjectId
  product: ProductList | ProductList[]
  total_quantity: number
  total_price: number
  fee: number
  total_bill: number
  shipper?: ObjectId | null
  user?: ObjectId | null
  name: string
  email: string
  phone: string
  address: string
  payment_status?: PaymentStatus
  order_status?: OrderOnlineStatus
  created_at?: Date
  confirmmed_at?: Date
  delivering_at?: Date
  delivered_at?: Date
  updated_at?: Date
}

export default class OrderOnline {
  _id: ObjectId
  product: ProductList | ProductList[]
  total_quantity: number
  total_price: number
  fee: number
  total_bill: number
  shipper: ObjectId | null
  user: ObjectId | null
  name: string
  email: string
  phone: string
  address: string
  payment_status: PaymentStatus
  order_status: OrderOnlineStatus
  created_at: Date
  confirmmed_at: Date
  delivering_at: Date
  delivered_at: Date
  updated_at: Date

  constructor(order: OrderOnlineType) {
    const date = new Date()

    this._id = order._id || new ObjectId()
    this.product = order.product
    this.total_quantity = order.total_quantity
    this.total_price = order.total_price
    this.fee = order.fee
    this.total_bill = order.total_bill
    this.shipper = order.shipper || null
    this.user = order.user || null
    this.name = order.name
    this.email = order.email
    this.phone = order.phone
    this.address = order.address
    this.payment_status = order.payment_status || PaymentStatus.PENDING
    this.order_status = order.order_status || OrderOnlineStatus.PENDING
    this.created_at = order.created_at || date
    this.confirmmed_at = order.confirmmed_at || date
    this.delivering_at = order.delivering_at || date
    this.delivered_at = order.delivered_at || date
    this.updated_at = order.updated_at || date
  }
}
