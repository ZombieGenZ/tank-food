import {
  OrderOnlineRequestsBody,
  CheckoutOrderRequestBody,
  OrderApprovalRequestsBody,
  cancelOrderEmployeeRequestsBody,
  ReceiveDeliveryRequestsBody
} from '~/models/requests/order.requests'
import User from '~/models/schemas/users.schemas'
import { CalculateShippingCosts } from '~/utils/ai.utils'
import axios from 'axios'
import { extractLocationData } from '~/utils/string.utils'
import databaseService from './database.services'
import Order from '~/models/schemas/orders.schemas'
import {
  ProductList,
  DeliveryTypeEnum,
  PaymentTypeEnum,
  PaymentStatusEnum,
  OrderStatusEnum
} from '~/constants/order.constants'
import { ObjectId } from 'mongodb'
import paymentHistoryService from './paymentHistory.services'
import { LANGUAGE } from '~/constants/language.constants'
import { VIETNAMESE_DYNAMIC_MAIL, ENGLIS_DYNAMIC_MAIL } from '~/constants/mail.constants'
import { randomVoucherCode } from '~/utils/random.utils'
import { sendMail } from '~/utils/mail.utils'
import voucherPrivateService from './voucherPrivate.services'
import { notificationRealtime } from '~/utils/realtime.utils'

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

    const order_id = new ObjectId()
    const order = new Order({
      _id: order_id,
      product: product_list,
      total_quantity: total_quantity,
      total_price: total_price,
      discount_code: payload.voucher,
      fee: fee,
      vat: vat,
      total_bill: total_bill,
      delivery_type: DeliveryTypeEnum.DELIVERY,
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
      node: payload.note,
      is_first_transaction: is_first_transaction,
      payment_type: PaymentTypeEnum.BANK
    })

    await Promise.all([
      databaseService.order.insertOne(order),
      notificationRealtime(`freshSync-employee`, 'create-order', 'order/create', order),
      notificationRealtime(`freshSync-user-${user._id}`, 'create-order', `order/${user._id}/create`, order)
    ])

    return {
      payment_qr_url: `https://qr.sepay.vn/img?acc=${process.env.BANK_ACCOUNT_NO}&bank=${process.env.BANK_BANK_ID}&amount=${total_bill}&des=DH${order._id}&template=compact`,
      order_id: `DH${order._id}`,
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
      order.payment_type == PaymentTypeEnum.CASH ||
      order.payment_status !== PaymentStatusEnum.PENDING ||
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
          payment_status: PaymentStatusEnum.PAID
        }
      }
    )
  }
  async getNewOrderEmployee(user: User) {
    return await databaseService.order
      .find({
        user: { $ne: user._id },
        payment_status: PaymentStatusEnum.PAID,
        order_status: OrderStatusEnum.PENDING
      })
      .toArray()
  }
  async getOldOrderEmployee(user: User) {
    return await databaseService.order
      .find({
        user: { $ne: user._id },
        payment_status: PaymentStatusEnum.PAID,
        order_status: { $ne: OrderStatusEnum.PENDING }
      })
      .toArray()
  }
  async orderApproval(payload: OrderApprovalRequestsBody, order: Order, user: User, language: string) {
    if (
      order.payment_type === PaymentTypeEnum.BANK &&
      order.user !== null &&
      order.payment_status === PaymentStatusEnum.PAID &&
      !payload.decision
    ) {
      const buyer = (await databaseService.users.findOne({ _id: order.user })) as User
      const code = randomVoucherCode()

      await voucherPrivateService.insertVoucher(code, order.total_bill, buyer._id)

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
            order_status: OrderStatusEnum.CONFIRMED,
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
            order_status: OrderStatusEnum.CANCELED,
            cancellation_reason: payload.reason,
            moderated_by: user._id,
            canceled_by: user._id
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
  async cancelOrderEmployee(payload: cancelOrderEmployeeRequestsBody, order: Order, user: User, language: string) {
    if (
      order.payment_type === PaymentTypeEnum.BANK &&
      order.user !== null &&
      order.payment_status === PaymentStatusEnum.PAID &&
      order.order_status !== OrderStatusEnum.COMPLETED
    ) {
      const buyer = (await databaseService.users.findOne({ _id: order.user })) as User
      const code = randomVoucherCode()

      await voucherPrivateService.insertVoucher(code, order.total_bill, buyer._id)

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

    await databaseService.order.updateOne(
      {
        _id: order._id
      },
      {
        $set: {
          order_status: OrderStatusEnum.CANCELED,
          cancellation_reason: payload.reason,
          canceled_by: user._id
        },
        $currentDate: {
          canceled_at: true,
          updated_at: true
        }
      }
    )
  }
  async getNewOrderShipper(user: User) {
    return await databaseService.order
      .find({
        user: { $ne: user._id },
        delivery_type: DeliveryTypeEnum.DELIVERY,
        payment_status: PaymentStatusEnum.PAID,
        order_status: OrderStatusEnum.CONFIRMED
      })
      .toArray()
  }
  async getOldOrderShipper(user: User) {
    return await databaseService.order
      .find({
        user: { $ne: user._id },
        shipper: user._id,
        payment_status: PaymentStatusEnum.PAID,
        order_status: { $ne: OrderStatusEnum.PENDING }
      })
      .toArray()
  }
  async receiveDeliveryShipper(payload: ReceiveDeliveryRequestsBody, user: User) {
    await databaseService.order.updateOne(
      {
        _id: new ObjectId(payload.order_id)
      },
      {
        $set: {
          shipper: user._id,
          order_status: OrderStatusEnum.DELIVERING
        },
        $currentDate: {
          updated_at: true,
          delivering_at: true
        }
      }
    )
  }
}

const orderService = new OrderService()
export default orderService
