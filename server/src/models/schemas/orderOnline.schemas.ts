// import { ObjectId } from 'mongodb'
// import { ProductList, PaymentStatus, OrderOnlineStatus } from '~/constants/order.constants'

// interface OrderOnlineType {
//   _id?: ObjectId
//   product: ProductList[]
//   total_quantity: number
//   total_price: number
//   fee: number
//   vat: number
//   total_bill: number
//   shipper?: ObjectId | null
//   user?: ObjectId | null
//   name: string
//   email: string
//   phone: string
//   delivery_address: string // địa chỉ giao
//   receiving_address: string // địa chỉ nhận
//   delivery_longitude: number // kinh độ giao hàng
//   receiving_longitude: number // kinh độ nhận hàng
//   delivery_latitude: number // vĩ độ giao hàng
//   receiving_latitude: number // vĩ độ nhận hàng
//   is_first_transaction?: boolean
//   payment_status?: PaymentStatus
//   order_status?: OrderOnlineStatus
//   cancellation_reason?: string
//   created_at?: Date
//   confirmmed_at?: Date
//   delivering_at?: Date
//   delivered_at?: Date
//   updated_at?: Date
//   canceled_at?: Date
// }

// export default class OrderOnline {
//   _id: ObjectId
//   product: ProductList[]
//   total_quantity: number
//   total_price: number
//   fee: number
//   vat: number
//   total_bill: number
//   shipper: ObjectId | null
//   user: ObjectId | null
//   name: string
//   email: string
//   phone: string
//   delivery_address: string
//   receiving_address: string
//   delivery_longitude: number
//   receiving_longitude: number
//   delivery_latitude: number
//   receiving_latitude: number
//   is_first_transaction: boolean
//   payment_status: PaymentStatus
//   order_status: OrderOnlineStatus
//   cancellation_reason: string
//   created_at: Date
//   confirmmed_at: Date
//   delivering_at: Date
//   delivered_at: Date
//   updated_at: Date
//   canceled_at: Date

//   constructor(order: OrderOnlineType) {
//     const date = new Date()

//     this._id = order._id || new ObjectId()
//     this.product = order.product
//     this.total_quantity = order.total_quantity
//     this.total_price = order.total_price
//     this.fee = order.fee
//     this.vat = order.vat
//     this.total_bill = order.total_bill
//     this.shipper = order.shipper || null
//     this.user = order.user || null
//     this.name = order.name
//     this.email = order.email
//     this.phone = order.phone
//     this.delivery_address = order.delivery_address
//     this.receiving_address = order.receiving_address
//     this.delivery_longitude = order.delivery_longitude
//     this.receiving_longitude = order.receiving_longitude
//     this.delivery_latitude = order.delivery_latitude
//     this.receiving_latitude = order.receiving_latitude
//     this.is_first_transaction = order.is_first_transaction || false
//     this.payment_status = order.payment_status || PaymentStatus.PENDING
//     this.order_status = order.order_status || OrderOnlineStatus.PENDING
//     this.cancellation_reason = order.cancellation_reason || ''
//     this.created_at = order.created_at || date
//     this.confirmmed_at = order.confirmmed_at || date
//     this.delivering_at = order.delivering_at || date
//     this.delivered_at = order.delivered_at || date
//     this.updated_at = order.updated_at || date
//     this.canceled_at = order.canceled_at || date
//   }
// }
