import {
  OrderOnlineRequestsBody,
  CheckoutOrderRequestBody,
  OrderApprovalRequestsBody
} from '~/models/requests/order.requests'
import User from '~/models/schemas/users.schemas'
import { CalculateShippingCosts } from '~/utils/ai.utils'
import axios from 'axios'
import { extractLocationData } from '~/utils/string.utils'
import databaseService from './database.services'
import Order from '~/models/schemas/orders.schemas'
import { OrderStatus, PaymentStatus, PaymentType, ProductList } from '~/constants/order.constants'
import { ObjectId } from 'mongodb'
import paymentHistoryService from './paymentHistory.services'
import { LANGUAGE } from '~/constants/language.constants'
import { VIETNAMESE_DYNAMIC_MAIL, ENGLIS_DYNAMIC_MAIL } from '~/constants/mail.constants'
import { randomVoucherCode } from '~/utils/random.utils'
import { sendMail } from '~/utils/mail.utils'

class OrderService {
  async orderOnline(
    payload: OrderOnlineRequestsBody,
    user: User,
    total_quantity: number,
    total_price: number,
    product_list: ProductList[]
  ) {
    const delivery_latitude = Number(process.env.LOCATION_DELIVERY_LATITUDE as string)
    const delivery_longitude = Number(process.env.LOCATION_DELIVERY_LONGITUDE as string)
    const [delivery, receiving] = await Promise.all([
      axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${delivery_latitude}&lon=${delivery_longitude}`
      ),
      axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${payload.receiving_latitude}&lon=${payload.receiving_longitude}`
      )
    ])
    const delivery_address = receiving.data.display_name
    const receiving_address = delivery.data.display_name
    const locationData = await CalculateShippingCosts(delivery_address, receiving_address)
    const location = extractLocationData(locationData)

    const fee = location.travelCost
    const bill = total_price + fee
    const vat = (total_price / 100) * 10
    const total_bill = bill + vat

    const userOrder = await databaseService.order.findOne({ user: user._id })
    let is_first_transaction: boolean
    if (userOrder) {
      is_first_transaction = false
    } else {
      is_first_transaction = true
    }

    const order = await databaseService.order.insertOne(
      new Order({
        product: product_list,
        total_quantity: total_quantity,
        total_price: total_price,
        discount_code: payload.voucher,
        fee: fee,
        vat: vat,
        total_bill: total_bill,
        user: user._id,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        delivery_address: delivery_address,
        receiving_address: receiving_address,
        delivery_nation: location.departureCountry,
        receiving_nation: location.destinationCountry,
        delivery_longitude: delivery_longitude,
        receiving_longitude: payload.receiving_longitude,
        delivery_latitude: delivery_longitude,
        receiving_latitude: payload.receiving_latitude,
        distance: location.distance,
        suggested_route: location.suggestedRoute,
        estimated_time: location.estimatedTime,
        is_first_transaction: is_first_transaction,
        payment_type: PaymentType.BANK
      })
    )

    return {
      payment_qr_url: `https://qr.sepay.vn/img?acc=${process.env.BANK_ACCOUNT_NO}&bank=${process.env.BANK_BANK_ID}&amount=${total_bill}&des=DH${order.insertedId}&template=compact`,
      order_id: `DH${order.insertedId}`,
      account_no: process.env.BANK_ACCOUNT_NO,
      account_name: process.env.BANK_ACCOUNT_NAME,
      bank_id: process.env.BANK_BANK_ID,
      product: product_list,
      total_quantity: total_quantity,
      total_price: total_price,
      fee: fee,
      vat: vat,
      total_bill: total_bill,
      distance: location.distance
    }
  }
  async checkout(payload: CheckoutOrderRequestBody) {
    if (payload.code == null) {
      return
    }

    const order_id = payload.code.substring(2)

    const order = await databaseService.order.findOne({ _id: new ObjectId(order_id) })

    await paymentHistoryService.insertHistory(payload)

    if (
      !order ||
      order.payment_type == PaymentType.CASH ||
      order.payment_status !== PaymentStatus.PENDING ||
      payload.transferAmount !== order.total_bill
    ) {
      return
    }

    await databaseService.order.updateOne(
      {
        _id: order._id
      },
      {
        $set: {
          payment_status: PaymentStatus.PAID
        }
      }
    )
  }
  async getNewOrderEmployee() {
    return await databaseService.order
      .find({
        payment_status: PaymentStatus.PAID,
        order_status: OrderStatus.PENDING
      })
      .toArray()
  }
  async getOldOrderEmployee() {
    return await databaseService.order
      .find({
        payment_status: PaymentStatus.PAID,
        order_status: { $ne: OrderStatus.PENDING }
      })
      .toArray()
  }
  async OrderApproval(payload: OrderApprovalRequestsBody, order: Order, user: User, language: string) {
    if (order.payment_type === PaymentType.BANK && order.user !== null && order.payment_status === PaymentStatus.PAID) {
      const buyer = (await databaseService.users.findOne({ _id: order.user })) as User
      const code = randomVoucherCode()

      const email_subject =
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_DYNAMIC_MAIL.voucher(code, order.total_bill).subject
          : ENGLIS_DYNAMIC_MAIL.voucher(code, order.total_bill).subject
      const email_html =
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_DYNAMIC_MAIL.voucher(code, order.total_bill).html
          : ENGLIS_DYNAMIC_MAIL.voucher(code, order.total_bill).html

      await sendMail(buyer.email, email_subject, email_html)
    }

    if (payload.decision) {
      await databaseService.order.updateOne(
        {
          _id: order._id
        },
        {
          $set: {
            order_status: OrderStatus.CONFIRMED,
            moderated_by: user._id
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
      return
    } else {
      await databaseService.order.updateOne(
        {
          _id: order._id
        },
        {
          $set: {
            order_status: OrderStatus.CANCELED,
            cancellation_reason: payload.reason,
            moderated_by: user._id
          },
          $currentDate: {
            canceled_at: true,
            updated_at: true
          }
        }
      )
      return
    }
  }
}

const orderService = new OrderService()
export default orderService
