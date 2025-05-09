// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { ObjectId } from 'mongodb'
import {
  ProductList,
  DeliveryTypeEnum,
  PaymentTypeEnum,
  PaymentStatusEnum,
  OrderStatusEnum
} from '~/constants/orders.constants'

interface OrderType {
  _id?: ObjectId
  product: ProductList[]
  total_quantity: number
  total_price: number
  discount_code?: string
  discount?: number
  fee?: number
  vat: number
  total_bill: number
  delivery_type: DeliveryTypeEnum
  shipper?: ObjectId | null
  user?: ObjectId | null
  name?: string
  email?: string
  phone?: string
  delivery_address?: string // địa chỉ giao
  receiving_address?: string // địa chỉ nhận
  delivery_nation?: string // quốc gia giao
  receiving_nation?: string // quốc gia nhận
  delivery_longitude?: number // kinh độ giao hàng
  receiving_longitude?: number // kinh độ nhận hàng
  delivery_latitude?: number // vĩ độ giao hàng
  receiving_latitude?: number // vĩ độ nhận hàng
  distance?: number // khoản cách
  suggested_route?: string // tuyến đường đề xuất
  estimated_time?: string // thời gian ước tính
  node?: string
  is_first_transaction?: boolean
  payment_type: PaymentTypeEnum
  payment_status?: PaymentStatusEnum
  order_status?: OrderStatusEnum
  bill_url?: string
  cancellation_reason?: string
  moderated_by?: ObjectId
  canceled_by?: ObjectId
  created_at?: Date
  confirmmed_at?: Date
  delivering_at?: Date
  delivered_at?: Date
  completed_at?: Date
  updated_at?: Date
  canceled_at?: Date
}

export default class Order {
  _id: ObjectId
  product: ProductList[]
  total_quantity: number
  total_price: number
  discount_code: string
  discount: number
  fee: number
  vat: number
  total_bill: number
  delivery_type: DeliveryTypeEnum
  shipper: ObjectId | null
  user: ObjectId | null
  name: string | null
  email: string | null
  phone: string | null
  delivery_address: string | null
  receiving_address: string | null
  delivery_nation: string | null
  receiving_nation: string | null
  delivery_longitude: number | null
  receiving_longitude: number | null
  delivery_latitude: number | null
  receiving_latitude: number | null
  distance: number | null
  suggested_route: string | null
  estimated_time: string | null
  node: string
  is_first_transaction: boolean | null
  payment_type: PaymentTypeEnum
  payment_status: PaymentStatusEnum
  order_status: OrderStatusEnum
  bill_url: string
  cancellation_reason: string
  moderated_by: ObjectId | null
  canceled_by: ObjectId | null
  created_at: Date
  confirmmed_at: Date
  delivering_at: Date
  delivered_at: Date
  completed_at: Date
  updated_at: Date
  canceled_at: Date

  constructor(order: OrderType) {
    const date = new Date()

    this._id = order._id || new ObjectId()
    this.product = order.product
    this.total_quantity = order.total_quantity
    this.total_price = order.total_price
    this.discount_code = order.discount_code || ''
    this.discount = order.discount || 0
    this.fee = order.fee || 0
    this.vat = order.vat
    this.total_bill = order.total_bill
    this.delivery_type = order.delivery_type
    this.shipper = order.shipper || null
    this.user = order.user || null
    this.name = order.name || null
    this.email = order.email || null
    this.phone = order.phone || null
    this.delivery_address = order.delivery_address || null
    this.receiving_address = order.receiving_address || null
    this.delivery_nation = order.delivery_nation || null
    this.receiving_nation = order.receiving_nation || null
    this.delivery_longitude = order.delivery_longitude || null
    this.receiving_longitude = order.receiving_longitude || null
    this.delivery_latitude = order.delivery_latitude || null
    this.receiving_latitude = order.receiving_latitude || null
    this.distance = order.distance || null
    this.suggested_route = order.suggested_route || null
    this.estimated_time = order.estimated_time || null
    this.node = order.node || ''
    this.is_first_transaction = order.is_first_transaction || false
    this.payment_type = order.payment_type
    this.payment_status = order.payment_status || PaymentStatusEnum.PENDING
    this.order_status = order.order_status || OrderStatusEnum.PENDING
    this.bill_url = order.bill_url || ''
    this.cancellation_reason = order.cancellation_reason || ''
    this.moderated_by = order.moderated_by || null
    this.canceled_by = order.canceled_by || null
    this.created_at = order.created_at || date
    this.confirmmed_at = order.confirmmed_at || date
    this.delivering_at = order.delivering_at || date
    this.delivered_at = order.delivered_at || date
    this.completed_at = order.completed_at || date
    this.updated_at = order.updated_at || date
    this.canceled_at = order.canceled_at || date
  }
}
