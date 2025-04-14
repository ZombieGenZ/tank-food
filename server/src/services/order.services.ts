import {
  OrderOnlineRequestsBody,
  CheckoutOrderRequestBody,
  OrderApprovalRequestsBody,
  CancelOrderEmployeeRequestsBody,
  OrderCompletionConfirmationRequestsBody,
  ReceiveDeliveryRequestsBody,
  CancelOrderShipperRequestsBody,
  ConfirmDeliveryCompletionRequestsBody,
  OrderOfflineRequestsBody,
  PaymentConfirmationRequestsBody,
  CancelOrderRequestsBody
} from '~/models/requests/orders.requests'
import User from '~/models/schemas/users.schemas'
import { calculateShippingCosts } from '~/utils/ai.utils'
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
} from '~/constants/orders.constants'
import { ObjectId } from 'mongodb'
import paymentHistoryService from './paymentHistory.services'
import { LANGUAGE } from '~/constants/language.constants'
import { VIETNAMESE_DYNAMIC_MAIL, ENGLIS_DYNAMIC_MAIL } from '~/constants/mail.constants'
import { randomVoucherCode } from '~/utils/random.utils'
import { sendMail } from '~/utils/mail.utils'
import voucherPrivateService from './voucherPrivate.services'
import { notificationRealtime } from '~/utils/realtime.utils'
import { UserRoleEnum } from '~/constants/users.constants'
import { serverLanguage } from '~/index'
import notificationService from './notifications.services'

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
    const locationData = await calculateShippingCosts(delivery_address, receiving_address)
    const location = extractLocationData(locationData)

    const fee = location.travelCost
    const bill = total_price + fee
    const vat = (total_price / 100) * Number(process.env.PAYMENT_VAT)
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
      product: product_list.map(({ data, ...rest }) => rest),
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

    await databaseService.order.insertOne(order)

    const orderWithDetails = await databaseService.order
      .aggregate([
        { $match: { _id: order_id } },
        {
          $lookup: {
            from: process.env.DATABASE_PRODUCT_COLLECTION as string,
            localField: 'product.product_id',
            foreignField: '_id',
            as: 'product_details'
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'product_details.category',
            foreignField: '_id',
            as: 'category_details'
          }
        },
        {
          $addFields: {
            product: {
              $map: {
                input: '$product',
                as: 'p',
                in: {
                  $mergeObjects: [
                    '$$p',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$product_details',
                            as: 'pd',
                            cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                          }
                        },
                        0
                      ]
                    },
                    {
                      category: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$category_details',
                              as: 'cd',
                              cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            product: { $first: '$product' },
            total_quantity: { $first: '$total_quantity' },
            total_price: { $first: '$total_price' },
            discount_code: { $first: '$discount_code' },
            discount: { $first: '$discount' },
            fee: { $first: '$fee' },
            vat: { $first: '$vat' },
            total_bill: { $first: '$total_bill' },
            delivery_type: { $first: '$delivery_type' },
            shipper: { $first: '$shipper' },
            user: { $first: '$user' },
            name: { $first: '$name' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            delivery_address: { $first: '$delivery_address' },
            receiving_address: { $first: '$receiving_address' },
            delivery_nation: { $first: '$delivery_nation' },
            receiving_nation: { $first: '$receiving_nation' },
            delivery_longitude: { $first: '$delivery_longitude' },
            receiving_longitude: { $first: '$receiving_longitude' },
            delivery_latitude: { $first: '$delivery_latitude' },
            receiving_latitude: { $first: '$receiving_latitude' },
            distance: { $first: '$distance' },
            suggested_route: { $first: '$suggested_route' },
            estimated_time: { $first: '$estimated_time' },
            node: { $first: '$node' },
            is_first_transaction: { $first: '$is_first_transaction' },
            payment_type: { $first: '$payment_type' },
            payment_status: { $first: '$payment_status' },
            order_status: { $first: '$order_status' },
            cancellation_reason: { $first: '$cancellation_reason' },
            moderated_by: { $first: '$moderated_by' },
            canceled_by: { $first: '$canceled_by' },
            created_at: { $first: '$created_at' },
            confirmmed_at: { $first: '$confirmmed_at' },
            delivering_at: { $first: '$delivering_at' },
            delivered_at: { $first: '$delivered_at' },
            completed_at: { $first: '$completed_at' },
            updated_at: { $first: '$updated_at' },
            canceled_at: { $first: '$canceled_at' }
          }
        }
      ])
      .next()

    const language = payload.language || serverLanguage

    await Promise.all([
      notificationRealtime(`freshSync-employee`, 'create-order', 'order/create', orderWithDetails),
      notificationRealtime(
        `freshSync-user-${user._id}`,
        'create-order-booking',
        `order/${user._id}/create`,
        orderWithDetails
      ),
      sendMail(
        payload.email,
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_DYNAMIC_MAIL.electronicInvoice(product_list, total_price, fee, vat, total_bill).subject
          : ENGLIS_DYNAMIC_MAIL.electronicInvoice(product_list, total_price, fee, vat, total_bill).subject,
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_DYNAMIC_MAIL.electronicInvoice(product_list, total_price, fee, vat, total_bill).html
          : ENGLIS_DYNAMIC_MAIL.electronicInvoice(product_list, total_price, fee, vat, total_bill).html
        )
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

    const orderWithDetails = await databaseService.order
      .aggregate([
        { $match: { _id: new ObjectId(order_id) } },
        {
          $lookup: {
            from: process.env.DATABASE_PRODUCT_COLLECTION as string,
            localField: 'product.product_id',
            foreignField: '_id',
            as: 'product_details'
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'product_details.category',
            foreignField: '_id',
            as: 'category_details'
          }
        },
        {
          $addFields: {
            product: {
              $map: {
                input: '$product',
                as: 'p',
                in: {
                  $mergeObjects: [
                    '$$p',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$product_details',
                            as: 'pd',
                            cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                          }
                        },
                        0
                      ]
                    },
                    {
                      category: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$category_details',
                              as: 'cd',
                              cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            product: { $first: '$product' },
            total_quantity: { $first: '$total_quantity' },
            total_price: { $first: '$total_price' },
            discount_code: { $first: '$discount_code' },
            discount: { $first: '$discount' },
            fee: { $first: '$fee' },
            vat: { $first: '$vat' },
            total_bill: { $first: '$total_bill' },
            delivery_type: { $first: '$delivery_type' },
            shipper: { $first: '$shipper' },
            user: { $first: '$user' },
            name: { $first: '$name' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            delivery_address: { $first: '$delivery_address' },
            receiving_address: { $first: '$receiving_address' },
            delivery_nation: { $first: '$delivery_nation' },
            receiving_nation: { $first: '$receiving_nation' },
            delivery_longitude: { $first: '$delivery_longitude' },
            receiving_longitude: { $first: '$receiving_longitude' },
            delivery_latitude: { $first: '$delivery_latitude' },
            receiving_latitude: { $first: '$receiving_latitude' },
            distance: { $first: '$distance' },
            suggested_route: { $first: '$suggested_route' },
            estimated_time: { $first: '$estimated_time' },
            node: { $first: '$node' },
            is_first_transaction: { $first: '$is_first_transaction' },
            payment_type: { $first: '$payment_type' },
            payment_status: { $first: '$payment_status' },
            order_status: { $first: '$order_status' },
            cancellation_reason: { $first: '$cancellation_reason' },
            moderated_by: { $first: '$moderated_by' },
            canceled_by: { $first: '$canceled_by' },
            created_at: { $first: '$created_at' },
            confirmmed_at: { $first: '$confirmmed_at' },
            delivering_at: { $first: '$delivering_at' },
            delivered_at: { $first: '$delivered_at' },
            completed_at: { $first: '$completed_at' },
            updated_at: { $first: '$updated_at' },
            canceled_at: { $first: '$canceled_at' }
          }
        }
      ])
      .next()

    const data = {
      ...payload,
      ...orderWithDetails,
      payment_status: PaymentStatusEnum.PAID
    }

    if (
      !order ||
      order.payment_type == PaymentTypeEnum.CASH ||
      order.payment_status !== PaymentStatusEnum.PENDING ||
      payload.transferAmount !== order.total_bill
    ) {
      return
    }

    await Promise.all([
      databaseService.order.updateOne(
        {
          _id: order._id
        },
        {
          $set: {
            payment_status: PaymentStatusEnum.PAID
          }
        }
      ),
      notificationRealtime(`freshSync-payment-DH${order._id}`, 'payment_notification', `payment/${order._id}`, data),
      notificationRealtime(`freshSync-employee`, 'checkout-order', `order/checkout`, data),
      notificationService.sendNotificationAllEmployee(
        ` 🔔 Đơn hàng #${order._id} đã được đặt và thanh toán thành công. Vui lòng kiểm tra và xác nhận đơn hàng!`
      )
    ])

    if (order.user) {
      await notificationRealtime(`freshSync-user-${order.user}`, 'checkout-order-booking', `order/${order.user}/checkout`, data)
    }
  }
  async getNewOrderEmployee(user: User) {
    if (user.role == UserRoleEnum.ADMINISTRATOR) {
      const orders = await databaseService.order
        .aggregate([
          {
            $match: {
              order_status: OrderStatusEnum.PENDING
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_PRODUCT_COLLECTION as string,
              localField: 'product.product_id',
              foreignField: '_id',
              as: 'product_details'
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_CATEGORY_COLLECTION as string,
              localField: 'product_details.category',
              foreignField: '_id',
              as: 'category_details'
            }
          },
          {
            $addFields: {
              product: {
                $map: {
                  input: '$product',
                  as: 'p',
                  in: {
                    $mergeObjects: [
                      '$$p',
                      {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$product_details',
                              as: 'pd',
                              cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                            }
                          },
                          0
                        ]
                      },
                      {
                        category: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$category_details',
                                as: 'cd',
                                cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                              }
                            },
                            0
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: '$_id',
              product: { $first: '$product' },
              total_quantity: { $first: '$total_quantity' },
              total_price: { $first: '$total_price' },
              discount_code: { $first: '$discount_code' },
              discount: { $first: '$discount' },
              fee: { $first: '$fee' },
              vat: { $first: '$vat' },
              total_bill: { $first: '$total_bill' },
              delivery_type: { $first: '$delivery_type' },
              shipper: { $first: '$shipper' },
              user: { $first: '$user' },
              name: { $first: '$name' },
              email: { $first: '$email' },
              phone: { $first: '$phone' },
              delivery_address: { $first: '$delivery_address' },
              receiving_address: { $first: '$receiving_address' },
              delivery_nation: { $first: '$delivery_nation' },
              receiving_nation: { $first: '$receiving_nation' },
              delivery_longitude: { $first: '$delivery_longitude' },
              receiving_longitude: { $first: '$receiving_longitude' },
              delivery_latitude: { $first: '$delivery_latitude' },
              receiving_latitude: { $first: '$receiving_latitude' },
              distance: { $first: '$distance' },
              suggested_route: { $first: '$suggested_route' },
              estimated_time: { $first: '$estimated_time' },
              node: { $first: '$node' },
              is_first_transaction: { $first: '$is_first_transaction' },
              payment_type: { $first: '$payment_type' },
              payment_status: { $first: '$payment_status' },
              order_status: { $first: '$order_status' },
              cancellation_reason: { $first: '$cancellation_reason' },
              moderated_by: { $first: '$moderated_by' },
              canceled_by: { $first: '$canceled_by' },
              created_at: { $first: '$created_at' },
              confirmmed_at: { $first: '$confirmmed_at' },
              delivering_at: { $first: '$delivering_at' },
              delivered_at: { $first: '$delivered_at' },
              completed_at: { $first: '$completed_at' },
              updated_at: { $first: '$updated_at' },
              canceled_at: { $first: '$canceled_at' }
            }
          },
          {
            $sort: { created_at: 1 }
          }
        ])
        .toArray()
      return orders
    } else {
      const orders = await databaseService.order
        .aggregate([
          {
            $match: {
              user: { $ne: user._id },
              order_status: OrderStatusEnum.PENDING
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_PRODUCT_COLLECTION as string,
              localField: 'product.product_id',
              foreignField: '_id',
              as: 'product_details'
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_CATEGORY_COLLECTION as string,
              localField: 'product_details.category',
              foreignField: '_id',
              as: 'category_details'
            }
          },
          {
            $addFields: {
              product: {
                $map: {
                  input: '$product',
                  as: 'p',
                  in: {
                    $mergeObjects: [
                      '$$p',
                      {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$product_details',
                              as: 'pd',
                              cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                            }
                          },
                          0
                        ]
                      },
                      {
                        category: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$category_details',
                                as: 'cd',
                                cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                              }
                            },
                            0
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: '$_id',
              product: { $first: '$product' },
              total_quantity: { $first: '$total_quantity' },
              total_price: { $first: '$total_price' },
              discount_code: { $first: '$discount_code' },
              discount: { $first: '$discount' },
              fee: { $first: '$fee' },
              vat: { $first: '$vat' },
              total_bill: { $first: '$total_bill' },
              delivery_type: { $first: '$delivery_type' },
              shipper: { $first: '$shipper' },
              user: { $first: '$user' },
              name: { $first: '$name' },
              email: { $first: '$email' },
              phone: { $first: '$phone' },
              delivery_address: { $first: '$delivery_address' },
              receiving_address: { $first: '$receiving_address' },
              delivery_nation: { $first: '$delivery_nation' },
              receiving_nation: { $first: '$receiving_nation' },
              delivery_longitude: { $first: '$delivery_longitude' },
              receiving_longitude: { $first: '$receiving_longitude' },
              delivery_latitude: { $first: '$delivery_latitude' },
              receiving_latitude: { $first: '$receiving_latitude' },
              distance: { $first: '$distance' },
              suggested_route: { $first: '$suggested_route' },
              estimated_time: { $first: '$estimated_time' },
              node: { $first: '$node' },
              is_first_transaction: { $first: '$is_first_transaction' },
              payment_type: { $first: '$payment_type' },
              payment_status: { $first: '$payment_status' },
              order_status: { $first: '$order_status' },
              cancellation_reason: { $first: '$cancellation_reason' },
              moderated_by: { $first: '$moderated_by' },
              canceled_by: { $first: '$canceled_by' },
              created_at: { $first: '$created_at' },
              confirmmed_at: { $first: '$confirmmed_at' },
              delivering_at: { $first: '$delivering_at' },
              delivered_at: { $first: '$delivered_at' },
              completed_at: { $first: '$completed_at' },
              updated_at: { $first: '$updated_at' },
              canceled_at: { $first: '$canceled_at' }
            }
          },
          {
            $sort: { created_at: 1 }
          }
        ])
        .toArray()
      return orders
    }
  }
  async getOldOrderEmployee(user: User) {
    let orders
    if (user.role == UserRoleEnum.ADMINISTRATOR) {
      orders = await databaseService.order
        .aggregate([
          {
            $match: {
              order_status: { $ne: OrderStatusEnum.PENDING }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_PRODUCT_COLLECTION as string,
              localField: 'product.product_id',
              foreignField: '_id',
              as: 'product_details'
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_CATEGORY_COLLECTION as string,
              localField: 'product_details.category',
              foreignField: '_id',
              as: 'category_details'
            }
          },
          {
            $addFields: {
              product: {
                $map: {
                  input: '$product',
                  as: 'p',
                  in: {
                    $mergeObjects: [
                      '$$p',
                      {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$product_details',
                              as: 'pd',
                              cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                            }
                          },
                          0
                        ]
                      },
                      {
                        category: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$category_details',
                                as: 'cd',
                                cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                              }
                            },
                            0
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: '$_id',
              product: { $first: '$product' },
              total_quantity: { $first: '$total_quantity' },
              total_price: { $first: '$total_price' },
              discount_code: { $first: '$discount_code' },
              discount: { $first: '$discount' },
              fee: { $first: '$fee' },
              vat: { $first: '$vat' },
              total_bill: { $first: '$total_bill' },
              delivery_type: { $first: '$delivery_type' },
              shipper: { $first: '$shipper' },
              user: { $first: '$user' },
              name: { $first: '$name' },
              email: { $first: '$email' },
              phone: { $first: '$phone' },
              delivery_address: { $first: '$delivery_address' },
              receiving_address: { $first: '$receiving_address' },
              delivery_nation: { $first: '$delivery_nation' },
              receiving_nation: { $first: '$receiving_nation' },
              delivery_longitude: { $first: '$delivery_longitude' },
              receiving_longitude: { $first: '$receiving_longitude' },
              delivery_latitude: { $first: '$delivery_latitude' },
              receiving_latitude: { $first: '$receiving_latitude' },
              distance: { $first: '$distance' },
              suggested_route: { $first: '$suggested_route' },
              estimated_time: { $first: '$estimated_time' },
              node: { $first: '$node' },
              is_first_transaction: { $first: '$is_first_transaction' },
              payment_type: { $first: '$payment_type' },
              payment_status: { $first: '$payment_status' },
              order_status: { $first: '$order_status' },
              cancellation_reason: { $first: '$cancellation_reason' },
              moderated_by: { $first: '$moderated_by' },
              canceled_by: { $first: '$canceled_by' },
              created_at: { $first: '$created_at' },
              confirmmed_at: { $first: '$confirmmed_at' },
              delivering_at: { $first: '$delivering_at' },
              delivered_at: { $first: '$delivered_at' },
              completed_at: { $first: '$completed_at' },
              updated_at: { $first: '$updated_at' },
              canceled_at: { $first: '$canceled_at' }
            }
          },
          {
            $sort: { created_at: -1 }
          }
        ])
        .toArray()
    } else {
      orders = await databaseService.order
        .aggregate([
          {
            $match: {
              user: { $ne: user._id },
              payment_status: PaymentStatusEnum.PAID,
              order_status: { $ne: OrderStatusEnum.PENDING }
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_PRODUCT_COLLECTION as string,
              localField: 'product.product_id',
              foreignField: '_id',
              as: 'product_details'
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_CATEGORY_COLLECTION as string,
              localField: 'product_details.category',
              foreignField: '_id',
              as: 'category_details'
            }
          },
          {
            $addFields: {
              product: {
                $map: {
                  input: '$product',
                  as: 'p',
                  in: {
                    $mergeObjects: [
                      '$$p',
                      {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$product_details',
                              as: 'pd',
                              cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                            }
                          },
                          0
                        ]
                      },
                      {
                        category: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$category_details',
                                as: 'cd',
                                cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                              }
                            },
                            0
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: '$_id',
              product: { $first: '$product' },
              total_quantity: { $first: '$total_quantity' },
              total_price: { $first: '$total_price' },
              discount_code: { $first: '$discount_code' },
              discount: { $first: '$discount' },
              fee: { $first: '$fee' },
              vat: { $first: '$vat' },
              total_bill: { $first: '$total_bill' },
              delivery_type: { $first: '$delivery_type' },
              shipper: { $first: '$shipper' },
              user: { $first: '$user' },
              name: { $first: '$name' },
              email: { $first: '$email' },
              phone: { $first: '$phone' },
              delivery_address: { $first: '$delivery_address' },
              receiving_address: { $first: '$receiving_address' },
              delivery_nation: { $first: '$delivery_nation' },
              receiving_nation: { $first: '$receiving_nation' },
              delivery_longitude: { $first: '$delivery_longitude' },
              receiving_longitude: { $first: '$receiving_longitude' },
              delivery_latitude: { $first: '$delivery_latitude' },
              receiving_latitude: { $first: '$receiving_latitude' },
              distance: { $first: '$distance' },
              suggested_route: { $first: '$suggested_route' },
              estimated_time: { $first: '$estimated_time' },
              node: { $first: '$node' },
              is_first_transaction: { $first: '$is_first_transaction' },
              payment_type: { $first: '$payment_type' },
              payment_status: { $first: '$payment_status' },
              order_status: { $first: '$order_status' },
              cancellation_reason: { $first: '$cancellation_reason' },
              moderated_by: { $first: '$moderated_by' },
              canceled_by: { $first: '$canceled_by' },
              created_at: { $first: '$created_at' },
              confirmmed_at: { $first: '$confirmmed_at' },
              delivering_at: { $first: '$delivering_at' },
              delivered_at: { $first: '$delivered_at' },
              completed_at: { $first: '$completed_at' },
              updated_at: { $first: '$updated_at' },
              canceled_at: { $first: '$canceled_at' }
            }
          },
          {
            $sort: { created_at: -1 }
          }
        ])
        .toArray()
    }

    return orders
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

      const data = await databaseService.order
        .aggregate([
          { $match: { _id: order._id } },
          {
            $lookup: {
              from: process.env.DATABASE_PRODUCT_COLLECTION as string,
              localField: 'product.product_id',
              foreignField: '_id',
              as: 'product_details'
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_CATEGORY_COLLECTION as string,
              localField: 'product_details.category',
              foreignField: '_id',
              as: 'category_details'
            }
          },
          {
            $addFields: {
              product: {
                $map: {
                  input: '$product',
                  as: 'p',
                  in: {
                    $mergeObjects: [
                      '$$p',
                      {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$product_details',
                              as: 'pd',
                              cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                            }
                          },
                          0
                        ]
                      },
                      {
                        category: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$category_details',
                                as: 'cd',
                                cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                              }
                            },
                            0
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: '$_id',
              product: { $first: '$product' },
              total_quantity: { $first: '$total_quantity' },
              total_price: { $first: '$total_price' },
              discount_code: { $first: '$discount_code' },
              discount: { $first: '$discount' },
              fee: { $first: '$fee' },
              vat: { $first: '$vat' },
              total_bill: { $first: '$total_bill' },
              delivery_type: { $first: '$delivery_type' },
              shipper: { $first: '$shipper' },
              user: { $first: '$user' },
              name: { $first: '$name' },
              email: { $first: '$email' },
              phone: { $first: '$phone' },
              delivery_address: { $first: '$delivery_address' },
              receiving_address: { $first: '$receiving_address' },
              delivery_nation: { $first: '$delivery_nation' },
              receiving_nation: { $first: '$receiving_nation' },
              delivery_longitude: { $first: '$delivery_longitude' },
              receiving_longitude: { $first: '$receiving_longitude' },
              delivery_latitude: { $first: '$delivery_latitude' },
              receiving_latitude: { $first: '$receiving_latitude' },
              distance: { $first: '$distance' },
              suggested_route: { $first: '$suggested_route' },
              estimated_time: { $first: '$estimated_time' },
              node: { $first: '$node' },
              is_first_transaction: { $first: '$is_first_transaction' },
              payment_type: { $first: '$payment_type' },
              payment_status: { $first: '$payment_status' },
              order_status: { $first: '$order_status' },
              cancellation_reason: { $first: '$cancellation_reason' },
              moderated_by: { $first: '$moderated_by' },
              canceled_by: { $first: '$canceled_by' },
              created_at: { $first: '$created_at' },
              confirmmed_at: { $first: '$confirmmed_at' },
              delivering_at: { $first: '$delivering_at' },
              delivered_at: { $first: '$delivered_at' },
              completed_at: { $first: '$completed_at' },
              updated_at: { $first: '$updated_at' },
              canceled_at: { $first: '$canceled_at' }
            }
          }
        ])
        .next()

      if (order.delivery_type == DeliveryTypeEnum.DELIVERY) {
        notificationService.sendNotificationAllShipper(
          `📦 Đơn hàng #${order._id} chưa có người nhận. Nhận đơn ngay nếu bạn đã sẵn sàng!`
        )
      }

      await Promise.all([
        notificationRealtime('freshSync-employee', 'approval-order', 'order/approval', data),
        order.user &&
          notificationRealtime(`freshSync-user-${order.user}`, 'approval-order-booking', `order/${user._id}/approval`, data),
        order.delivery_type == DeliveryTypeEnum.DELIVERY &&
          notificationRealtime(`freshSync-shipper`, 'create-delivery', `order/${user._id}/create-delivery`, data),
        order.user &&
          notificationService.sendNotification(
            `✅ Đơn hàng #${order._id} của bạn đã được xác nhận. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!`,
            user._id
          )
      ])
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

      const data = await databaseService.order
        .aggregate([
          { $match: { _id: order._id } },
          {
            $lookup: {
              from: process.env.DATABASE_PRODUCT_COLLECTION as string,
              localField: 'product.product_id',
              foreignField: '_id',
              as: 'product_details'
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_CATEGORY_COLLECTION as string,
              localField: 'product_details.category',
              foreignField: '_id',
              as: 'category_details'
            }
          },
          {
            $addFields: {
              product: {
                $map: {
                  input: '$product',
                  as: 'p',
                  in: {
                    $mergeObjects: [
                      '$$p',
                      {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$product_details',
                              as: 'pd',
                              cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                            }
                          },
                          0
                        ]
                      },
                      {
                        category: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$category_details',
                                as: 'cd',
                                cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                              }
                            },
                            0
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: '$_id',
              product: { $first: '$product' },
              total_quantity: { $first: '$total_quantity' },
              total_price: { $first: '$total_price' },
              discount_code: { $first: '$discount_code' },
              discount: { $first: '$discount' },
              fee: { $first: '$fee' },
              vat: { $first: '$vat' },
              total_bill: { $first: '$total_bill' },
              delivery_type: { $first: '$delivery_type' },
              shipper: { $first: '$shipper' },
              user: { $first: '$user' },
              name: { $first: '$name' },
              email: { $first: '$email' },
              phone: { $first: '$phone' },
              delivery_address: { $first: '$delivery_address' },
              receiving_address: { $first: '$receiving_address' },
              delivery_nation: { $first: '$delivery_nation' },
              receiving_nation: { $first: '$receiving_nation' },
              delivery_longitude: { $first: '$delivery_longitude' },
              receiving_longitude: { $first: '$receiving_longitude' },
              delivery_latitude: { $first: '$delivery_latitude' },
              receiving_latitude: { $first: '$receiving_latitude' },
              distance: { $first: '$distance' },
              suggested_route: { $first: '$suggested_route' },
              estimated_time: { $first: '$estimated_time' },
              node: { $first: '$node' },
              is_first_transaction: { $first: '$is_first_transaction' },
              payment_type: { $first: '$payment_type' },
              payment_status: { $first: '$payment_status' },
              order_status: { $first: '$order_status' },
              cancellation_reason: { $first: '$cancellation_reason' },
              moderated_by: { $first: '$moderated_by' },
              canceled_by: { $first: '$canceled_by' },
              created_at: { $first: '$created_at' },
              confirmmed_at: { $first: '$confirmmed_at' },
              delivering_at: { $first: '$delivering_at' },
              delivered_at: { $first: '$delivered_at' },
              completed_at: { $first: '$completed_at' },
              updated_at: { $first: '$updated_at' },
              canceled_at: { $first: '$canceled_at' }
            }
          }
        ])
        .next()

      await Promise.all([
        notificationRealtime('freshSync-employee', 'approval-order', 'order/approval', data),
        order.user &&
          notificationRealtime(`freshSync-user-${order.user}`, 'approval-order-booking', `order/${user._id}/approval`, data),
        order.user &&
          notificationService.sendNotification(
          `❌ Đơn hàng #${order._id} của bạn đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ bộ phận hỗ trợ.`,
          user._id
          )
      ])
      return
    }
  }
  async cancelOrderEmployee(payload: CancelOrderEmployeeRequestsBody, order: Order, user: User, language: string) {
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

    const data = await databaseService.order
      .aggregate([
        { $match: { _id: order._id } },
        {
          $lookup: {
            from: process.env.DATABASE_PRODUCT_COLLECTION as string,
            localField: 'product.product_id',
            foreignField: '_id',
            as: 'product_details'
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'product_details.category',
            foreignField: '_id',
            as: 'category_details'
          }
        },
        {
          $addFields: {
            product: {
              $map: {
                input: '$product',
                as: 'p',
                in: {
                  $mergeObjects: [
                    '$$p',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$product_details',
                            as: 'pd',
                            cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                          }
                        },
                        0
                      ]
                    },
                    {
                      category: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$category_details',
                              as: 'cd',
                              cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            product: { $first: '$product' },
            total_quantity: { $first: '$total_quantity' },
            total_price: { $first: '$total_price' },
            discount_code: { $first: '$discount_code' },
            discount: { $first: '$discount' },
            fee: { $first: '$fee' },
            vat: { $first: '$vat' },
            total_bill: { $first: '$total_bill' },
            delivery_type: { $first: '$delivery_type' },
            shipper: { $first: '$shipper' },
            user: { $first: '$user' },
            name: { $first: '$name' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            delivery_address: { $first: '$delivery_address' },
            receiving_address: { $first: '$receiving_address' },
            delivery_nation: { $first: '$delivery_nation' },
            receiving_nation: { $first: '$receiving_nation' },
            delivery_longitude: { $first: '$delivery_longitude' },
            receiving_longitude: { $first: '$receiving_longitude' },
            delivery_latitude: { $first: '$delivery_latitude' },
            receiving_latitude: { $first: '$receiving_latitude' },
            distance: { $first: '$distance' },
            suggested_route: { $first: '$suggested_route' },
            estimated_time: { $first: '$estimated_time' },
            node: { $first: '$node' },
            is_first_transaction: { $first: '$is_first_transaction' },
            payment_type: { $first: '$payment_type' },
            payment_status: { $first: '$payment_status' },
            order_status: { $first: '$order_status' },
            cancellation_reason: { $first: '$cancellation_reason' },
            moderated_by: { $first: '$moderated_by' },
            canceled_by: { $first: '$canceled_by' },
            created_at: { $first: '$created_at' },
            confirmmed_at: { $first: '$confirmmed_at' },
            delivering_at: { $first: '$delivering_at' },
            delivered_at: { $first: '$delivered_at' },
            completed_at: { $first: '$completed_at' },
            updated_at: { $first: '$updated_at' },
            canceled_at: { $first: '$canceled_at' }
          }
        }
      ])
      .next()

    await Promise.all([
      notificationRealtime('freshSync-employee', 'cancel-order', 'order/cancel', data),
      order.user &&
        notificationRealtime(`freshSync-user-${order.user}`, 'cancel-order-booking', `order/${order.user}/cancel`, data),
      order.delivery_type === DeliveryTypeEnum.DELIVERY &&
        notificationRealtime(`freshSync-shipper`, 'remove-delivery', `delivery/remove`, data),
      order.shipper &&
        notificationRealtime(
          `freshSync-shipper-${order.shipper}`,
          'cancel-delivery',
          `delivery/${order.shipper}/cancel`,
          data
        ),
      order.user &&
        notificationService.sendNotification(
          `❌ Đơn hàng #${order._id} của bạn đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ bộ phận hỗ trợ.`,
          user._id
        )
    ])
  }
  async orderCompletionConfirmation(payload: OrderCompletionConfirmationRequestsBody, order: Order) {
    await databaseService.order.updateOne(
      {
        _id: new ObjectId(payload.order_id)
      },
      {
        $set: {
          order_status: OrderStatusEnum.COMPLETED
        },
        $currentDate: {
          completed_at: true,
          updated_at: true
        }
      }
    )

    const data = await databaseService.order
      .aggregate([
        { $match: { _id: new ObjectId(payload.order_id) } },
        {
          $lookup: {
            from: process.env.DATABASE_PRODUCT_COLLECTION as string,
            localField: 'product.product_id',
            foreignField: '_id',
            as: 'product_details'
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'product_details.category',
            foreignField: '_id',
            as: 'category_details'
          }
        },
        {
          $addFields: {
            product: {
              $map: {
                input: '$product',
                as: 'p',
                in: {
                  $mergeObjects: [
                    '$$p',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$product_details',
                            as: 'pd',
                            cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                          }
                        },
                        0
                      ]
                    },
                    {
                      category: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$category_details',
                              as: 'cd',
                              cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            product: { $first: '$product' },
            total_quantity: { $first: '$total_quantity' },
            total_price: { $first: '$total_price' },
            discount_code: { $first: '$discount_code' },
            discount: { $first: '$discount' },
            fee: { $first: '$fee' },
            vat: { $first: '$vat' },
            total_bill: { $first: '$total_bill' },
            delivery_type: { $first: '$delivery_type' },
            shipper: { $first: '$shipper' },
            user: { $first: '$user' },
            name: { $first: '$name' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            delivery_address: { $first: '$delivery_address' },
            receiving_address: { $first: '$receiving_address' },
            delivery_nation: { $first: '$delivery_nation' },
            receiving_nation: { $first: '$receiving_nation' },
            delivery_longitude: { $first: '$delivery_longitude' },
            receiving_longitude: { $first: '$receiving_longitude' },
            delivery_latitude: { $first: '$delivery_latitude' },
            receiving_latitude: { $first: '$receiving_latitude' },
            distance: { $first: '$distance' },
            suggested_route: { $first: '$suggested_route' },
            estimated_time: { $first: '$estimated_time' },
            node: { $first: '$node' },
            is_first_transaction: { $first: '$is_first_transaction' },
            payment_type: { $first: '$payment_type' },
            payment_status: { $first: '$payment_status' },
            order_status: { $first: '$order_status' },
            cancellation_reason: { $first: '$cancellation_reason' },
            moderated_by: { $first: '$moderated_by' },
            canceled_by: { $first: '$canceled_by' },
            created_at: { $first: '$created_at' },
            confirmmed_at: { $first: '$confirmmed_at' },
            delivering_at: { $first: '$delivering_at' },
            delivered_at: { $first: '$delivered_at' },
            completed_at: { $first: '$completed_at' },
            updated_at: { $first: '$updated_at' },
            canceled_at: { $first: '$canceled_at' }
          }
        }
      ])
      .next()

    const date = new Date()
    const fee = (order.fee / 100) * 15
    const revenue = order.total_price + fee

    const dataStatistical = {
      totalOrders: 1,
      totalProducts: order.total_quantity,
      totalNewCustomers: order.is_first_transaction ? 1 : 0,
      totalRevenue: revenue,
      date
    }

    await Promise.all([
      notificationRealtime('freshSync-employee', 'complete-order', 'order/complete', data),
      notificationRealtime('freshSync-statistical', 'update-chart', 'statistical/chart', dataStatistical),
      notificationRealtime('freshSync-statistical', 'update-order-complete', 'statistical/complete', data),
      order.user &&
        notificationRealtime(`freshSync-user-${order.user}`, 'complete-order-booking', `order/${order.user}/complete`, data)
    ])
  }
  async getNewOrderShipper(user: User) {
    let orders
    if (user.role == UserRoleEnum.ADMINISTRATOR) {
      orders = await databaseService.order
        .aggregate([
          {
            $match: {
              delivery_type: DeliveryTypeEnum.DELIVERY,
              payment_status: PaymentStatusEnum.PAID,
              order_status: OrderStatusEnum.CONFIRMED
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_PRODUCT_COLLECTION as string,
              localField: 'product.product_id',
              foreignField: '_id',
              as: 'product_details'
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_CATEGORY_COLLECTION as string,
              localField: 'product_details.category',
              foreignField: '_id',
              as: 'category_details'
            }
          },
          {
            $addFields: {
              product: {
                $map: {
                  input: '$product',
                  as: 'p',
                  in: {
                    $mergeObjects: [
                      '$$p',
                      {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$product_details',
                              as: 'pd',
                              cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                            }
                          },
                          0
                        ]
                      },
                      {
                        category: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$category_details',
                                as: 'cd',
                                cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                              }
                            },
                            0
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: '$_id',
              product: { $first: '$product' },
              total_quantity: { $first: '$total_quantity' },
              total_price: { $first: '$total_price' },
              discount_code: { $first: '$discount_code' },
              discount: { $first: '$discount' },
              fee: { $first: '$fee' },
              vat: { $first: '$vat' },
              total_bill: { $first: '$total_bill' },
              delivery_type: { $first: '$delivery_type' },
              shipper: { $first: '$shipper' },
              user: { $first: '$user' },
              name: { $first: '$name' },
              email: { $first: '$email' },
              phone: { $first: '$phone' },
              delivery_address: { $first: '$delivery_address' },
              receiving_address: { $first: '$receiving_address' },
              delivery_nation: { $first: '$delivery_nation' },
              receiving_nation: { $first: '$receiving_nation' },
              delivery_longitude: { $first: '$delivery_longitude' },
              receiving_longitude: { $first: '$receiving_longitude' },
              delivery_latitude: { $first: '$delivery_latitude' },
              receiving_latitude: { $first: '$receiving_latitude' },
              distance: { $first: '$distance' },
              suggested_route: { $first: '$suggested_route' },
              estimated_time: { $first: '$estimated_time' },
              node: { $first: '$node' },
              is_first_transaction: { $first: '$is_first_transaction' },
              payment_type: { $first: '$payment_type' },
              payment_status: { $first: '$payment_status' },
              order_status: { $first: '$order_status' },
              cancellation_reason: { $first: '$cancellation_reason' },
              moderated_by: { $first: '$moderated_by' },
              canceled_by: { $first: '$canceled_by' },
              created_at: { $first: '$created_at' },
              confirmmed_at: { $first: '$confirmmed_at' },
              delivering_at: { $first: '$delivering_at' },
              delivered_at: { $first: '$delivered_at' },
              completed_at: { $first: '$completed_at' },
              updated_at: { $first: '$updated_at' },
              canceled_at: { $first: '$canceled_at' }
            }
          },
          {
            $sort: { created_at: 1 }
          }
        ])
        .toArray()
    } else {
      orders = await databaseService.order
        .aggregate([
          {
            $match: {
              user: { $ne: user._id },
              delivery_type: DeliveryTypeEnum.DELIVERY,
              payment_status: PaymentStatusEnum.PAID,
              order_status: OrderStatusEnum.CONFIRMED
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_PRODUCT_COLLECTION as string,
              localField: 'product.product_id',
              foreignField: '_id',
              as: 'product_details'
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_CATEGORY_COLLECTION as string,
              localField: 'product_details.category',
              foreignField: '_id',
              as: 'category_details'
            }
          },
          {
            $addFields: {
              product: {
                $map: {
                  input: '$product',
                  as: 'p',
                  in: {
                    $mergeObjects: [
                      '$$p',
                      {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$product_details',
                              as: 'pd',
                              cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                            }
                          },
                          0
                        ]
                      },
                      {
                        category: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$category_details',
                                as: 'cd',
                                cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                              }
                            },
                            0
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: '$_id',
              product: { $first: '$product' },
              total_quantity: { $first: '$total_quantity' },
              total_price: { $first: '$total_price' },
              discount_code: { $first: '$discount_code' },
              discount: { $first: '$discount' },
              fee: { $first: '$fee' },
              vat: { $first: '$vat' },
              total_bill: { $first: '$total_bill' },
              delivery_type: { $first: '$delivery_type' },
              shipper: { $first: '$shipper' },
              user: { $first: '$user' },
              name: { $first: '$name' },
              email: { $first: '$email' },
              phone: { $first: '$phone' },
              delivery_address: { $first: '$delivery_address' },
              receiving_address: { $first: '$receiving_address' },
              delivery_nation: { $first: '$delivery_nation' },
              receiving_nation: { $first: '$receiving_nation' },
              delivery_longitude: { $first: '$delivery_longitude' },
              receiving_longitude: { $first: '$receiving_longitude' },
              delivery_latitude: { $first: '$delivery_latitude' },
              receiving_latitude: { $first: '$receiving_latitude' },
              distance: { $first: '$distance' },
              suggested_route: { $first: '$suggested_route' },
              estimated_time: { $first: '$estimated_time' },
              node: { $first: '$node' },
              is_first_transaction: { $first: '$is_first_transaction' },
              payment_type: { $first: '$payment_type' },
              payment_status: { $first: '$payment_status' },
              order_status: { $first: '$order_status' },
              cancellation_reason: { $first: '$cancellation_reason' },
              moderated_by: { $first: '$moderated_by' },
              canceled_by: { $first: '$canceled_by' },
              created_at: { $first: '$created_at' },
              confirmmed_at: { $first: '$confirmmed_at' },
              delivering_at: { $first: '$delivering_at' },
              delivered_at: { $first: '$delivered_at' },
              completed_at: { $first: '$completed_at' },
              updated_at: { $first: '$updated_at' },
              canceled_at: { $first: '$canceled_at' }
            }
          },
          {
            $sort: { created_at: 1 }
          }
        ])
        .toArray()
    }
    return orders
  }
  async getOldOrderShipper(user: User) {
    let orders
    if (user.role == UserRoleEnum.ADMINISTRATOR) {
      orders = await databaseService.order
        .aggregate([
          {
            $match: {
              payment_status: PaymentStatusEnum.PAID,
              order_status: {
                $in: [OrderStatusEnum.DELIVERING, OrderStatusEnum.DELIVERED, OrderStatusEnum.COMPLETED]
              },
              delivery_type: DeliveryTypeEnum.DELIVERY
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_PRODUCT_COLLECTION as string,
              localField: 'product.product_id',
              foreignField: '_id',
              as: 'product_details'
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_CATEGORY_COLLECTION as string,
              localField: 'product_details.category',
              foreignField: '_id',
              as: 'category_details'
            }
          },
          {
            $addFields: {
              product: {
                $map: {
                  input: '$product',
                  as: 'p',
                  in: {
                    $mergeObjects: [
                      '$$p',
                      {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$product_details',
                              as: 'pd',
                              cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                            }
                          },
                          0
                        ]
                      },
                      {
                        category: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$category_details',
                                as: 'cd',
                                cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                              }
                            },
                            0
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: '$_id',
              product: { $first: '$product' },
              total_quantity: { $first: '$total_quantity' },
              total_price: { $first: '$total_price' },
              discount_code: { $first: '$discount_code' },
              discount: { $first: '$discount' },
              fee: { $first: '$fee' },
              vat: { $first: '$vat' },
              total_bill: { $first: '$total_bill' },
              delivery_type: { $first: '$delivery_type' },
              shipper: { $first: '$shipper' },
              user: { $first: '$user' },
              name: { $first: '$name' },
              email: { $first: '$email' },
              phone: { $first: '$phone' },
              delivery_address: { $first: '$delivery_address' },
              receiving_address: { $first: '$receiving_address' },
              delivery_nation: { $first: '$delivery_nation' },
              receiving_nation: { $first: '$receiving_nation' },
              delivery_longitude: { $first: '$delivery_longitude' },
              receiving_longitude: { $first: '$receiving_longitude' },
              delivery_latitude: { $first: '$delivery_latitude' },
              receiving_latitude: { $first: '$receiving_latitude' },
              distance: { $first: '$distance' },
              suggested_route: { $first: '$suggested_route' },
              estimated_time: { $first: '$estimated_time' },
              node: { $first: '$node' },
              is_first_transaction: { $first: '$is_first_transaction' },
              payment_type: { $first: '$payment_type' },
              payment_status: { $first: '$payment_status' },
              order_status: { $first: '$order_status' },
              cancellation_reason: { $first: '$cancellation_reason' },
              moderated_by: { $first: '$moderated_by' },
              canceled_by: { $first: '$canceled_by' },
              created_at: { $first: '$created_at' },
              confirmmed_at: { $first: '$confirmmed_at' },
              delivering_at: { $first: '$delivering_at' },
              delivered_at: { $first: '$delivered_at' },
              completed_at: { $first: '$completed_at' },
              updated_at: { $first: '$updated_at' },
              canceled_at: { $first: '$canceled_at' }
            }
          },
          {
            $sort: { created_at: -1 }
          }
        ])
        .toArray()
    } else {
      orders = await databaseService.order
        .aggregate([
          {
            $match: {
              user: { $ne: user._id },
              shipper: user._id,
              payment_status: PaymentStatusEnum.PAID,
              order_status: {
                $in: [OrderStatusEnum.DELIVERING, OrderStatusEnum.DELIVERED, OrderStatusEnum.COMPLETED]
              },
              delivery_type: DeliveryTypeEnum.DELIVERY
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_PRODUCT_COLLECTION as string,
              localField: 'product.product_id',
              foreignField: '_id',
              as: 'product_details'
            }
          },
          {
            $lookup: {
              from: process.env.DATABASE_CATEGORY_COLLECTION as string,
              localField: 'product_details.category',
              foreignField: '_id',
              as: 'category_details'
            }
          },
          {
            $addFields: {
              product: {
                $map: {
                  input: '$product',
                  as: 'p',
                  in: {
                    $mergeObjects: [
                      '$$p',
                      {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$product_details',
                              as: 'pd',
                              cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                            }
                          },
                          0
                        ]
                      },
                      {
                        category: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$category_details',
                                as: 'cd',
                                cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                              }
                            },
                            0
                          ]
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            $group: {
              _id: '$_id',
              product: { $first: '$product' },
              total_quantity: { $first: '$total_quantity' },
              total_price: { $first: '$total_price' },
              discount_code: { $first: '$discount_code' },
              discount: { $first: '$discount' },
              fee: { $first: '$fee' },
              vat: { $first: '$vat' },
              total_bill: { $first: '$total_bill' },
              delivery_type: { $first: '$delivery_type' },
              shipper: { $first: '$shipper' },
              user: { $first: '$user' },
              name: { $first: '$name' },
              email: { $first: '$email' },
              phone: { $first: '$phone' },
              delivery_address: { $first: '$delivery_address' },
              receiving_address: { $first: '$receiving_address' },
              delivery_nation: { $first: '$delivery_nation' },
              receiving_nation: { $first: '$receiving_nation' },
              delivery_longitude: { $first: '$delivery_longitude' },
              receiving_longitude: { $first: '$receiving_longitude' },
              delivery_latitude: { $first: '$delivery_latitude' },
              receiving_latitude: { $first: '$receiving_latitude' },
              distance: { $first: '$distance' },
              suggested_route: { $first: '$suggested_route' },
              estimated_time: { $first: '$estimated_time' },
              node: { $first: '$node' },
              is_first_transaction: { $first: '$is_first_transaction' },
              payment_type: { $first: '$payment_type' },
              payment_status: { $first: '$payment_status' },
              order_status: { $first: '$order_status' },
              cancellation_reason: { $first: '$cancellation_reason' },
              moderated_by: { $first: '$moderated_by' },
              canceled_by: { $first: '$canceled_by' },
              created_at: { $first: '$created_at' },
              confirmmed_at: { $first: '$confirmmed_at' },
              delivering_at: { $first: '$delivering_at' },
              delivered_at: { $first: '$delivered_at' },
              completed_at: { $first: '$completed_at' },
              updated_at: { $first: '$updated_at' },
              canceled_at: { $first: '$canceled_at' }
            }
          },
          {
            $sort: { created_at: -1 }
          }
        ])
        .toArray()
    }
    return orders
  }
  async receiveDeliveryShipper(payload: ReceiveDeliveryRequestsBody, user: User, order: Order) {
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

    const data = await databaseService.order
      .aggregate([
        { $match: { _id: new ObjectId(payload.order_id) } },
        {
          $lookup: {
            from: process.env.DATABASE_PRODUCT_COLLECTION as string,
            localField: 'product.product_id',
            foreignField: '_id',
            as: 'product_details'
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'product_details.category',
            foreignField: '_id',
            as: 'category_details'
          }
        },
        {
          $addFields: {
            product: {
              $map: {
                input: '$product',
                as: 'p',
                in: {
                  $mergeObjects: [
                    '$$p',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$product_details',
                            as: 'pd',
                            cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                          }
                        },
                        0
                      ]
                    },
                    {
                      category: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$category_details',
                              as: 'cd',
                              cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            product: { $first: '$product' },
            total_quantity: { $first: '$total_quantity' },
            total_price: { $first: '$total_price' },
            discount_code: { $first: '$discount_code' },
            discount: { $first: '$discount' },
            fee: { $first: '$fee' },
            vat: { $first: '$vat' },
            total_bill: { $first: '$total_bill' },
            delivery_type: { $first: '$delivery_type' },
            shipper: { $first: '$shipper' },
            user: { $first: '$user' },
            name: { $first: '$name' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            delivery_address: { $first: '$delivery_address' },
            receiving_address: { $first: '$receiving_address' },
            delivery_nation: { $first: '$delivery_nation' },
            receiving_nation: { $first: '$receiving_nation' },
            delivery_longitude: { $first: '$delivery_longitude' },
            receiving_longitude: { $first: '$receiving_longitude' },
            delivery_latitude: { $first: '$delivery_latitude' },
            receiving_latitude: { $first: '$receiving_latitude' },
            distance: { $first: '$distance' },
            suggested_route: { $first: '$suggested_route' },
            estimated_time: { $first: '$estimated_time' },
            node: { $first: '$node' },
            is_first_transaction: { $first: '$is_first_transaction' },
            payment_type: { $first: '$payment_type' },
            payment_status: { $first: '$payment_status' },
            order_status: { $first: '$order_status' },
            cancellation_reason: { $first: '$cancellation_reason' },
            moderated_by: { $first: '$moderated_by' },
            canceled_by: { $first: '$canceled_by' },
            created_at: { $first: '$created_at' },
            confirmmed_at: { $first: '$confirmmed_at' },
            delivering_at: { $first: '$delivering_at' },
            delivered_at: { $first: '$delivered_at' },
            completed_at: { $first: '$completed_at' },
            updated_at: { $first: '$updated_at' },
            canceled_at: { $first: '$canceled_at' }
          }
        }
      ])
      .next()

    await Promise.all([
      notificationRealtime(
        `freshSync-user-${order.user}`,
        'delivery-order',
        `delivery/${order.user}/delivery-order`,
        data
      ),
      notificationRealtime(`freshSync-shipper`, 'remove-delivery', `delivery/remove`, data),
      notificationService.sendNotification(
        `Đơn hàng #${order._id} đang được giao.`,
        order._id
      )
    ])
  }
  async cancelOrderShipper(payload: CancelOrderShipperRequestsBody, order: Order) {
    await databaseService.order.updateOne(
      {
        _id: new ObjectId(payload.order_id)
      },
      {
        $set: {
          order_status: OrderStatusEnum.CONFIRMED,
          shipper: null
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    const data = await databaseService.order
      .aggregate([
        { $match: { _id: new ObjectId(payload.order_id) } },
        {
          $lookup: {
            from: process.env.DATABASE_PRODUCT_COLLECTION as string,
            localField: 'product.product_id',
            foreignField: '_id',
            as: 'product_details'
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'product_details.category',
            foreignField: '_id',
            as: 'category_details'
          }
        },
        {
          $addFields: {
            product: {
              $map: {
                input: '$product',
                as: 'p',
                in: {
                  $mergeObjects: [
                    '$$p',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$product_details',
                            as: 'pd',
                            cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                          }
                        },
                        0
                      ]
                    },
                    {
                      category: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$category_details',
                              as: 'cd',
                              cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            product: { $first: '$product' },
            total_quantity: { $first: '$total_quantity' },
            total_price: { $first: '$total_price' },
            discount_code: { $first: '$discount_code' },
            discount: { $first: '$discount' },
            fee: { $first: '$fee' },
            vat: { $first: '$vat' },
            total_bill: { $first: '$total_bill' },
            delivery_type: { $first: '$delivery_type' },
            shipper: { $first: '$shipper' },
            user: { $first: '$user' },
            name: { $first: '$name' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            delivery_address: { $first: '$delivery_address' },
            receiving_address: { $first: '$receiving_address' },
            delivery_nation: { $first: '$delivery_nation' },
            receiving_nation: { $first: '$receiving_nation' },
            delivery_longitude: { $first: '$delivery_longitude' },
            receiving_longitude: { $first: '$receiving_longitude' },
            delivery_latitude: { $first: '$delivery_latitude' },
            receiving_latitude: { $first: '$receiving_latitude' },
            distance: { $first: '$distance' },
            suggested_route: { $first: '$suggested_route' },
            estimated_time: { $first: '$estimated_time' },
            node: { $first: '$node' },
            is_first_transaction: { $first: '$is_first_transaction' },
            payment_type: { $first: '$payment_type' },
            payment_status: { $first: '$payment_status' },
            order_status: { $first: '$order_status' },
            cancellation_reason: { $first: '$cancellation_reason' },
            moderated_by: { $first: '$moderated_by' },
            canceled_by: { $first: '$canceled_by' },
            created_at: { $first: '$created_at' },
            confirmmed_at: { $first: '$confirmmed_at' },
            delivering_at: { $first: '$delivering_at' },
            delivered_at: { $first: '$delivered_at' },
            completed_at: { $first: '$completed_at' },
            updated_at: { $first: '$updated_at' },
            canceled_at: { $first: '$canceled_at' }
          }
        }
      ])
      .next()

    await Promise.all([
      notificationRealtime('freshSync-shipper', 'create-delivery', 'order/create-delivery', data),
      notificationRealtime(
        `freshSync-user-${order.user}`,
        'cancel-delivery',
        `order/${order.user}/cancel-delivery`,
        data
      ),
      notificationService.sendNotification(
        `📢 Đơn hàng #${order._id} hiện đang được xử lý lại do sự cố từ phía đơn vị vận chuyển. Chúng tôi sẽ cập nhật thời gian giao hàng sớm nhất cho bạn.`,
        order._id
      ),
      notificationService.sendNotificationAllShipper(
        `📦 Đơn hàng #${order._id} chưa có người nhận. Nhận đơn ngay nếu bạn đã sẵn sàng!`
      )
    ])
  }
  async confirmDeliveryCompletion(payload: ConfirmDeliveryCompletionRequestsBody, order: Order) {
    const salary = (order.fee / 100) * 85

    await Promise.all([
      databaseService.order.updateOne(
        {
          _id: new ObjectId(payload.order_id)
        },
        {
          $set: {
            order_status: OrderStatusEnum.COMPLETED
          },
          $currentDate: {
            delivered_at: true,
            updated_at: true,
            completed_at: true
          }
        }
      ),
      databaseService.users.updateOne(
        {
          _id: order.shipper as ObjectId
        },
        {
          $inc: {
            salary: salary
          }
        }
      )
    ])

    const data = await databaseService.order
      .aggregate([
        { $match: { _id: new ObjectId(payload.order_id) } },
        {
          $lookup: {
            from: process.env.DATABASE_PRODUCT_COLLECTION as string,
            localField: 'product.product_id',
            foreignField: '_id',
            as: 'product_details'
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'product_details.category',
            foreignField: '_id',
            as: 'category_details'
          }
        },
        {
          $addFields: {
            product: {
              $map: {
                input: '$product',
                as: 'p',
                in: {
                  $mergeObjects: [
                    '$$p',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$product_details',
                            as: 'pd',
                            cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                          }
                        },
                        0
                      ]
                    },
                    {
                      category: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$category_details',
                              as: 'cd',
                              cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            product: { $first: '$product' },
            total_quantity: { $first: '$total_quantity' },
            total_price: { $first: '$total_price' },
            discount_code: { $first: '$discount_code' },
            discount: { $first: '$discount' },
            fee: { $first: '$fee' },
            vat: { $first: '$vat' },
            total_bill: { $first: '$total_bill' },
            delivery_type: { $first: '$delivery_type' },
            shipper: { $first: '$shipper' },
            user: { $first: '$user' },
            name: { $first: '$name' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            delivery_address: { $first: '$delivery_address' },
            receiving_address: { $first: '$receiving_address' },
            delivery_nation: { $first: '$delivery_nation' },
            receiving_nation: { $first: '$receiving_nation' },
            delivery_longitude: { $first: '$delivery_longitude' },
            receiving_longitude: { $first: '$receiving_longitude' },
            delivery_latitude: { $first: '$delivery_latitude' },
            receiving_latitude: { $first: '$receiving_latitude' },
            distance: { $first: '$distance' },
            suggested_route: { $first: '$suggested_route' },
            estimated_time: { $first: '$estimated_time' },
            node: { $first: '$node' },
            is_first_transaction: { $first: '$is_first_transaction' },
            payment_type: { $first: '$payment_type' },
            payment_status: { $first: '$payment_status' },
            order_status: { $first: '$order_status' },
            cancellation_reason: { $first: '$cancellation_reason' },
            moderated_by: { $first: '$moderated_by' },
            canceled_by: { $first: '$canceled_by' },
            created_at: { $first: '$created_at' },
            confirmmed_at: { $first: '$confirmmed_at' },
            delivering_at: { $first: '$delivering_at' },
            delivered_at: { $first: '$delivered_at' },
            completed_at: { $first: '$completed_at' },
            updated_at: { $first: '$updated_at' },
            canceled_at: { $first: '$canceled_at' }
          }
        }
      ])
      .next()

    const date = new Date()
    const fee = (order.fee / 100) * 15
    const revenue = order.total_price + fee

    const dataStatistical = {
      totalOrders: 1,
      totalProducts: order.total_quantity,
      totalNewCustomers: order.is_first_transaction ? 1 : 0,
      totalRevenue: revenue,
      date
    }

    await Promise.all([
      notificationRealtime(
        `freshSync-user-${order.user}`,
        'complete-order-booking',
        `order/${order.user}/complete-order`,
        data
      ),
      notificationRealtime('freshSync-statistical', 'update-chart', 'statistical/chart', dataStatistical),
      notificationRealtime('freshSync-statistical', 'update-order-complete', 'statistical/complete', data),
      notificationService.sendNotification(
        `✅ Đơn hàng #${order._id} đã hoàn tất. Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!`,
        order._id
      )
    ])
  }
  async orderOffline(
    payload: OrderOfflineRequestsBody,
    total_quantity: number,
    total_price: number,
    product_list: ProductList[]
  ) {
    const vat = (total_price / 100) * Number(process.env.PAYMENT_VAT)
    const total_bill = total_price + vat

    const order_id = new ObjectId()
    const order = new Order({
      _id: order_id,
      delivery_type: DeliveryTypeEnum.COUNTER,
      payment_type: payload.payment_type,
      product: product_list.map(({ data, ...rest }) => rest),
      total_price: total_price,
      total_quantity: total_quantity,
      total_bill: total_bill,
      vat: vat
    })

    await databaseService.order.insertOne(order)

    const orderWithDetails = await databaseService.order
      .aggregate([
        { $match: { _id: order_id } },
        {
          $lookup: {
            from: process.env.DATABASE_PRODUCT_COLLECTION as string,
            localField: 'product.product_id',
            foreignField: '_id',
            as: 'product_details'
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'product_details.category',
            foreignField: '_id',
            as: 'category_details'
          }
        },
        {
          $addFields: {
            product: {
              $map: {
                input: '$product',
                as: 'p',
                in: {
                  $mergeObjects: [
                    '$$p',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$product_details',
                            as: 'pd',
                            cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                          }
                        },
                        0
                      ]
                    },
                    {
                      category: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$category_details',
                              as: 'cd',
                              cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            product: { $first: '$product' },
            total_quantity: { $first: '$total_quantity' },
            total_price: { $first: '$total_price' },
            discount_code: { $first: '$discount_code' },
            discount: { $first: '$discount' },
            fee: { $first: '$fee' },
            vat: { $first: '$vat' },
            total_bill: { $first: '$total_bill' },
            delivery_type: { $first: '$delivery_type' },
            shipper: { $first: '$shipper' },
            user: { $first: '$user' },
            name: { $first: '$name' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            delivery_address: { $first: '$delivery_address' },
            receiving_address: { $first: '$receiving_address' },
            delivery_nation: { $first: '$delivery_nation' },
            receiving_nation: { $first: '$receiving_nation' },
            delivery_longitude: { $first: '$delivery_longitude' },
            receiving_longitude: { $first: '$receiving_longitude' },
            delivery_latitude: { $first: '$delivery_latitude' },
            receiving_latitude: { $first: '$receiving_latitude' },
            distance: { $first: '$distance' },
            suggested_route: { $first: '$suggested_route' },
            estimated_time: { $first: '$estimated_time' },
            node: { $first: '$node' },
            is_first_transaction: { $first: '$is_first_transaction' },
            payment_type: { $first: '$payment_type' },
            payment_status: { $first: '$payment_status' },
            order_status: { $first: '$order_status' },
            cancellation_reason: { $first: '$cancellation_reason' },
            moderated_by: { $first: '$moderated_by' },
            canceled_by: { $first: '$canceled_by' },
            created_at: { $first: '$created_at' },
            confirmmed_at: { $first: '$confirmmed_at' },
            delivering_at: { $first: '$delivering_at' },
            delivered_at: { $first: '$delivered_at' },
            completed_at: { $first: '$completed_at' },
            updated_at: { $first: '$updated_at' },
            canceled_at: { $first: '$canceled_at' }
          }
        }
      ])
      .next()

    await  notificationRealtime(`freshSync-employee`, 'create-order', 'order/create', orderWithDetails)

    if (payload.payment_type == PaymentTypeEnum.BANK) {
      return {
        payment_qr_url: `https://qr.sepay.vn/img?acc=${process.env.BANK_ACCOUNT_NO}&bank=${process.env.BANK_BANK_ID}&amount=${total_bill}&des=DH${order._id}&template=compact`,
        order_id: `DH${order._id}`,
        account_no: process.env.BANK_ACCOUNT_NO,
        account_name: process.env.BANK_ACCOUNT_NAME,
        bank_id: process.env.BANK_BANK_ID,
        product: product_list,
        total_quantity: total_quantity,
        total_price: total_price,
        vat: vat,
        total_bill: total_bill
      }
    } else {
      await notificationService.sendNotificationAllEmployee(
        `🔔 Có đơn hàng mới được đặt tại quầy. Vui lòng kiểm tra và xử lý đơn hàng!`
      )

      return {
        product: product_list
      }
    }
  }
  async paymentConfirmation(payload: PaymentConfirmationRequestsBody) {
    await databaseService.order.updateOne(
      {
        _id: new ObjectId(payload.order_id)
      },
      {
        $set: {
          payment_status: PaymentStatusEnum.PAID
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    const data = await databaseService.order
      .aggregate([
        { $match: { _id: new ObjectId(payload.order_id) } },
        {
          $lookup: {
            from: process.env.DATABASE_PRODUCT_COLLECTION as string,
            localField: 'product.product_id',
            foreignField: '_id',
            as: 'product_details'
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'product_details.category',
            foreignField: '_id',
            as: 'category_details'
          }
        },
        {
          $addFields: {
            product: {
              $map: {
                input: '$product',
                as: 'p',
                in: {
                  $mergeObjects: [
                    '$$p',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$product_details',
                            as: 'pd',
                            cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                          }
                        },
                        0
                      ]
                    },
                    {
                      category: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$category_details',
                              as: 'cd',
                              cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            product: { $first: '$product' },
            total_quantity: { $first: '$total_quantity' },
            total_price: { $first: '$total_price' },
            discount_code: { $first: '$discount_code' },
            discount: { $first: '$discount' },
            fee: { $first: '$fee' },
            vat: { $first: '$vat' },
            total_bill: { $first: '$total_bill' },
            delivery_type: { $first: '$delivery_type' },
            shipper: { $first: '$shipper' },
            user: { $first: '$user' },
            name: { $first: '$name' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            delivery_address: { $first: '$delivery_address' },
            receiving_address: { $first: '$receiving_address' },
            delivery_nation: { $first: '$delivery_nation' },
            receiving_nation: { $first: '$receiving_nation' },
            delivery_longitude: { $first: '$delivery_longitude' },
            receiving_longitude: { $first: '$receiving_longitude' },
            delivery_latitude: { $first: '$delivery_latitude' },
            receiving_latitude: { $first: '$receiving_latitude' },
            distance: { $first: '$distance' },
            suggested_route: { $first: '$suggested_route' },
            estimated_time: { $first: '$estimated_time' },
            node: { $first: '$node' },
            is_first_transaction: { $first: '$is_first_transaction' },
            payment_type: { $first: '$payment_type' },
            payment_status: { $first: '$payment_status' },
            order_status: { $first: '$order_status' },
            cancellation_reason: { $first: '$cancellation_reason' },
            moderated_by: { $first: '$moderated_by' },
            canceled_by: { $first: '$canceled_by' },
            created_at: { $first: '$created_at' },
            confirmmed_at: { $first: '$confirmmed_at' },
            delivering_at: { $first: '$delivering_at' },
            delivered_at: { $first: '$delivered_at' },
            completed_at: { $first: '$completed_at' },
            updated_at: { $first: '$updated_at' },
            canceled_at: { $first: '$canceled_at' }
          }
        }
      ])
      .next()

    await Promise.all([
      notificationRealtime('freshSync-employee', 'payment-confirmation', 'order/payment-confirmation', data)
    ])
  }
  async getOrder(user: User) {
    const orders = await databaseService.order
      .aggregate([
        {
          $match: {
            user: user._id
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_PRODUCT_COLLECTION as string,
            localField: 'product.product_id',
            foreignField: '_id',
            as: 'product_details'
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'product_details.category',
            foreignField: '_id',
            as: 'category_details'
          }
        },
        {
          $addFields: {
            product: {
              $map: {
                input: '$product',
                as: 'p',
                in: {
                  $mergeObjects: [
                    '$$p',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$product_details',
                            as: 'pd',
                            cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                          }
                        },
                        0
                      ]
                    },
                    {
                      category: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$category_details',
                              as: 'cd',
                              cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            product: { $first: '$product' },
            total_quantity: { $first: '$total_quantity' },
            total_price: { $first: '$total_price' },
            discount_code: { $first: '$discount_code' },
            discount: { $first: '$discount' },
            fee: { $first: '$fee' },
            vat: { $first: '$vat' },
            total_bill: { $first: '$total_bill' },
            delivery_type: { $first: '$delivery_type' },
            shipper: { $first: '$shipper' },
            user: { $first: '$user' },
            name: { $first: '$name' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            delivery_address: { $first: '$delivery_address' },
            receiving_address: { $first: '$receiving_address' },
            delivery_nation: { $first: '$delivery_nation' },
            receiving_nation: { $first: '$receiving_nation' },
            delivery_longitude: { $first: '$delivery_longitude' },
            receiving_longitude: { $first: '$receiving_longitude' },
            delivery_latitude: { $first: '$delivery_latitude' },
            receiving_latitude: { $first: '$receiving_latitude' },
            distance: { $first: '$distance' },
            suggested_route: { $first: '$suggested_route' },
            estimated_time: { $first: '$estimated_time' },
            node: { $first: '$node' },
            is_first_transaction: { $first: '$is_first_transaction' },
            payment_type: { $first: '$payment_type' },
            payment_status: { $first: '$payment_status' },
            order_status: { $first: '$order_status' },
            cancellation_reason: { $first: '$cancellation_reason' },
            moderated_by: { $first: '$moderated_by' },
            canceled_by: { $first: '$canceled_by' },
            created_at: { $first: '$created_at' },
            confirmmed_at: { $first: '$confirmmed_at' },
            delivering_at: { $first: '$delivering_at' },
            delivered_at: { $first: '$delivered_at' },
            completed_at: { $first: '$completed_at' },
            updated_at: { $first: '$updated_at' },
            canceled_at: { $first: '$canceled_at' }
          }
        },
        {
          $sort: { created_at: -1 }
        }
      ])
      .toArray()
    return orders
  }
  async cancelOrder(payload: CancelOrderRequestsBody, user: User, order: Order) {
    await databaseService.order.updateOne(
      {
        _id: new ObjectId(payload.order_id)
      },
      {
        $set: {
          order_status: OrderStatusEnum.CANCELED,
          canceled_by: user._id
        },
        $currentDate: {
          canceled_at: true,
          updated_at: true
        }
      }
    )
    const data = await databaseService.order
      .aggregate([
        { $match: { _id: new ObjectId(payload.order_id) } },
        {
          $lookup: {
            from: process.env.DATABASE_PRODUCT_COLLECTION as string,
            localField: 'product.product_id',
            foreignField: '_id',
            as: 'product_details'
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'product_details.category',
            foreignField: '_id',
            as: 'category_details'
          }
        },
        {
          $addFields: {
            product: {
              $map: {
                input: '$product',
                as: 'p',
                in: {
                  $mergeObjects: [
                    '$$p',
                    {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$product_details',
                            as: 'pd',
                            cond: { $eq: ['$$p.product_id', '$$pd._id'] }
                          }
                        },
                        0
                      ]
                    },
                    {
                      category: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$category_details',
                              as: 'cd',
                              cond: { $eq: ['$$p.product_id', '$$cd._id'] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            product: { $first: '$product' },
            total_quantity: { $first: '$total_quantity' },
            total_price: { $first: '$total_price' },
            discount_code: { $first: '$discount_code' },
            discount: { $first: '$discount' },
            fee: { $first: '$fee' },
            vat: { $first: '$vat' },
            total_bill: { $first: '$total_bill' },
            delivery_type: { $first: '$delivery_type' },
            shipper: { $first: '$shipper' },
            user: { $first: '$user' },
            name: { $first: '$name' },
            email: { $first: '$email' },
            phone: { $first: '$phone' },
            delivery_address: { $first: '$delivery_address' },
            receiving_address: { $first: '$receiving_address' },
            delivery_nation: { $first: '$delivery_nation' },
            receiving_nation: { $first: '$receiving_nation' },
            delivery_longitude: { $first: '$delivery_longitude' },
            receiving_longitude: { $first: '$receiving_longitude' },
            delivery_latitude: { $first: '$delivery_latitude' },
            receiving_latitude: { $first: '$receiving_latitude' },
            distance: { $first: '$distance' },
            suggested_route: { $first: '$suggested_route' },
            estimated_time: { $first: '$estimated_time' },
            node: { $first: '$node' },
            is_first_transaction: { $first: '$is_first_transaction' },
            payment_type: { $first: '$payment_type' },
            payment_status: { $first: '$payment_status' },
            order_status: { $first: '$order_status' },
            cancellation_reason: { $first: '$cancellation_reason' },
            moderated_by: { $first: '$moderated_by' },
            canceled_by: { $first: '$canceled_by' },
            created_at: { $first: '$created_at' },
            confirmmed_at: { $first: '$confirmmed_at' },
            delivering_at: { $first: '$delivering_at' },
            delivered_at: { $first: '$delivered_at' },
            completed_at: { $first: '$completed_at' },
            updated_at: { $first: '$updated_at' },
            canceled_at: { $first: '$canceled_at' }
          }
        }
      ])
      .next()

    await Promise.all([
      notificationRealtime('freshSync-employee', 'cancel-order', 'order/cancel', data),
      notificationRealtime(`freshSync-user-${order.user}`, 'cancel-order-booking', `order/${order.user}/cancel`, data),
      order.order_status == OrderStatusEnum.DELIVERING &&
      order.shipper !== null &&
      notificationRealtime(
        `freshSync-shipper-${order.shipper}`,
        'cancel-delivery',
        `delivery/${order.shipper}/cancel`,
        data
      )
    ])
  }
  async getOrderOverview() {
    return await databaseService.order
      .find({ order_status: OrderStatusEnum.COMPLETED })
      .sort({ created_at: -1 })
      .limit(5)
      .toArray()
  }
  async getPaymentInfomation(order: Order) {
    const aggregateResult = await databaseService.order
      .aggregate([
        {
          $match: { _id: order._id }
        },
        {
          $unwind: '$product'
        },
        {
          $lookup: {
            from: process.env.DATABASE_PRODUCT_COLLECTION as string,
            localField: 'product.product_id',
            foreignField: '_id',
            as: 'product.data'
          }
        },
        {
          $unwind: {
            path: '$product.data',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$_id',
            product: {
              $push: {
                product_id: '$product.product_id',
                quantity: '$product.quantity',
                price: '$product.price',
                data: '$product.data'
              }
            }
          }
        },
        {
          $project: {
            product: 1,
            _id: 0
          }
        }
      ])
      .toArray()

    const products = aggregateResult[0]?.product || [];

    return {
      payment_qr_url: `https://qr.sepay.vn/img?acc=${process.env.BANK_ACCOUNT_NO}&bank=${process.env.BANK_BANK_ID}&amount=${order.total_bill}&des=DH${order._id}&template=compact`,
      order_id: `DH${order._id}`,
      account_no: process.env.BANK_ACCOUNT_NO,
      account_name: process.env.BANK_ACCOUNT_NAME,
      bank_id: process.env.BANK_BANK_ID,
      product: products,
      total_quantity: order.total_quantity,
      total_price: order.total_price,
      fee: order.fee,
      vat: order.vat,
      total_bill: order.total_bill,
      distance: order.distance
    }
  }
}

const orderService = new OrderService()
export default orderService
