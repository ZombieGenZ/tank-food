import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/users.schemas'
import {
  OrderOnlineRequestsBody,
  CheckoutOrderRequestBody,
  GetOrderRequestsBody,
  OrderApprovalRequestsBody,
  CancelOrderEmployeeRequestsBody,
  OrderCompletionConfirmationRequestsBody,
  ReceiveDeliveryRequestsBody,
  CancelOrderShipperRequestsBody,
  ConfirmDeliveryCompletionRequestsBody,
  OrderOfflineRequestsBody,
  PaymentConfirmationRequestsBody,
  CancelOrderRequestsBody,
  GetPaymentInfomationRequestsBody
} from '~/models/requests/orders.requests'
import { serverLanguage } from '~/index'
import {
  VIETNAMESE_STATIC_MESSAGE,
  ENGLISH_STATIC_MESSAGE,
  VIETNAMESE_DYNAMIC_MESSAGE,
  ENGLIS_DYNAMIC_MESSAGE
} from '~/constants/message.constants'
import { writeErrorLog, writeInfoLog } from '~/utils/log.utils'
import { LANGUAGE } from '~/constants/language.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import orderOnlineService from '~/services/order.services'
import { ProductList } from '~/constants/orders.constants'
import Order from '~/models/schemas/orders.schemas'

export const orderOnlineController = async (
  req: Request<ParamsDictionary, any, OrderOnlineRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const product_list = req.product_list as ProductList[]
  const language = req.body.language || serverLanguage

  const total_quantity = req.total_quantity as number
  const total_price = req.total_price as number

  try {
    const infomation = await orderOnlineService.orderOnline(req.body, user, total_quantity, total_price, product_list)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.OrderOnlineSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.OrderOnlineSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.CREATE_ORDER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CREATE_ORDER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CREATE_ORDER_SUCCESS,
      infomation
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.OrderOnlineFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.OrderOnlineFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.CREATE_ORDER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CREATE_ORDER_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CREATE_ORDER_FAILURE
    })
  }
}

export const checkoutOrderController = async (
  req: Request<ParamsDictionary, any, CheckoutOrderRequestBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const language = serverLanguage

  try {
    await orderOnlineService.checkout(req.body)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CheckoutOrderSuccessfully(ip)
        : ENGLIS_DYNAMIC_MESSAGE.CheckoutOrderSuccessfully(ip)
    )

    res.json({
      code: RESPONSE_CODE.CHECKOUT_ORDER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CHECKOUT_ORDER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CHECKOUT_ORDER_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CheckoutOrderFailed(ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.CheckoutOrderFailed(ip, err)
    )

    res.json({
      code: RESPONSE_CODE.CHECKOUT_ORDER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CHECKOUT_ORDER_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CHECKOUT_ORDER_FAILURE
    })
  }
}

export const getNewOrderEmployeeController = async (
  req: Request<ParamsDictionary, any, GetOrderRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const order = await orderOnlineService.getNewOrderEmployee(user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_SUCCESS,
      order
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_FAILURE
    })
  }
}

export const getOldOrderEmployeeController = async (
  req: Request<ParamsDictionary, any, GetOrderRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const order = await orderOnlineService.getOldOrderEmployee(user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_SUCCESS,
      order
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_FAILURE
    })
  }
}

export const orderApprovalEmployeeController = async (
  req: Request<ParamsDictionary, any, OrderApprovalRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const order = req.order as Order
  const language = req.body.language || serverLanguage

  try {
    await orderOnlineService.orderApproval(req.body, order, user, language)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.OrderApprovalSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.OrderApprovalSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.ORDER_APPROVAL_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_APPROVAL_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_APPROVAL_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.OrderApprovalFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.OrderApprovalFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.ORDER_APPROVAL_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_APPROVAL_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_APPROVAL_FAILURE
    })
  }
}

export const cancelOrderEmployeeController = async (
  req: Request<ParamsDictionary, any, CancelOrderEmployeeRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const order = req.order as Order
  const language = req.body.language || serverLanguage

  try {
    await orderOnlineService.cancelOrderEmployee(req.body, order, user, language)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CancelOrderSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.CancelOrderSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.CANCEL_ORDER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CANCEL_ORDER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CANCEL_ORDER_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CancelOrderFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.CancelOrderFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.CANCEL_ORDER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CANCEL_ORDER_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CANCEL_ORDER_FAILURE
    })
  }
}

export const orderCompletionConfirmationController = async (
  req: Request<ParamsDictionary, any, OrderCompletionConfirmationRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const order = req.order as Order
  const language = req.body.language || serverLanguage

  try {
    await orderOnlineService.orderCompletionConfirmation(req.body, order)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.OrderCompletionConfirmationSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.OrderCompletionConfirmationSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.ORDER_COMPLETION_CONFIRMATION_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_COMPLETION_CONFIRMATION_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_COMPLETION_CONFIRMATION_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.OrderCompletionConfirmationFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.OrderCompletionConfirmationFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.ORDER_COMPLETION_CONFIRMATION_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_COMPLETION_CONFIRMATION_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_COMPLETION_CONFIRMATION_FAILURE
    })
  }
}

export const getNewOrderShipperController = async (
  req: Request<ParamsDictionary, any, GetOrderRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const order = await orderOnlineService.getNewOrderShipper(user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_SUCCESS,
      order
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_FAILURE
    })
  }
}

export const getOldOrderShipperController = async (
  req: Request<ParamsDictionary, any, GetOrderRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const order = await orderOnlineService.getOldOrderShipper(user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_SUCCESS,
      order
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_FAILURE
    })
  }
}

export const receiveDeliveryShipperController = async (
  req: Request<ParamsDictionary, any, ReceiveDeliveryRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const order = req.order as Order
  const language = req.body.language || serverLanguage

  try {
    await orderOnlineService.receiveDeliveryShipper(req.body, user, order)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ReceiveDeliverySuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.ReceiveDeliverySuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.RECEIVE_DELIVERY_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.RECEIVE_DELIVERY_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.RECEIVE_DELIVERY_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ReceiveDeliveryFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.ReceiveDeliveryFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.RECEIVE_DELIVERY_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.RECEIVE_DELIVERY_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.RECEIVE_DELIVERY_FAILURE
    })
  }
}

export const cancelOrderShipperController = async (
  req: Request<ParamsDictionary, any, CancelOrderShipperRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const order = req.order as Order
  const language = req.body.language || serverLanguage

  try {
    await orderOnlineService.cancelOrderShipper(req.body, order)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CancelOrderSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.CancelOrderSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.CANCEL_ORDER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CANCEL_ORDER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CANCEL_ORDER_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CancelOrderFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.CancelOrderFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.CANCEL_ORDER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CANCEL_ORDER_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CANCEL_ORDER_FAILURE
    })
  }
}

export const confirmDeliveryCompletionController = async (
  req: Request<ParamsDictionary, any, ConfirmDeliveryCompletionRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const order = req.order as Order
  const language = req.body.language || serverLanguage

  try {
    await orderOnlineService.confirmDeliveryCompletion(req.body, order)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ConfirmDeliveryCompletionSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.ConfirmDeliveryCompletionSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.CONFIRM_DELIVERY_COMPLETION_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CONFIRM_DELIVERY_COMPLETION_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CONFIRM_DELIVERY_COMPLETION_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ConfirmDeliveryCompletionFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.ConfirmDeliveryCompletionFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.CONFIRM_DELIVERY_COMPLETION_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CONFIRM_DELIVERY_COMPLETION_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CONFIRM_DELIVERY_COMPLETION_FAILURE
    })
  }
}

export const orderOfflineController = async (
  req: Request<ParamsDictionary, any, OrderOfflineRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const product_list = req.product_list as ProductList[]
  const language = req.body.language || serverLanguage

  const total_quantity = req.total_quantity as number
  const total_price = req.total_price as number

  try {
    const infomation = await orderOnlineService.orderOffline(req.body, total_quantity, total_price, product_list)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.OrderOfflineSuccessfully(ip)
        : ENGLIS_DYNAMIC_MESSAGE.OrderOfflineSuccessfully(ip)
    )

    res.json({
      code: RESPONSE_CODE.CREATE_ORDER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CREATE_ORDER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CREATE_ORDER_SUCCESS,
      infomation
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.OrderOfflineFailed(ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.OrderOfflineFailed(ip, err)
    )

    res.json({
      code: RESPONSE_CODE.CREATE_ORDER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CREATE_ORDER_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CREATE_ORDER_FAILURE
    })
  }
}

export const paymentConfirmationController = async (
  req: Request<ParamsDictionary, any, PaymentConfirmationRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    await orderOnlineService.paymentConfirmation(req.body)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.PaymentConfirmationSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.PaymentConfirmationSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.PAYMENT_CONFIRMATION_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.PAYMENT_CONFIRMATION_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.PAYMENT_CONFIRMATION_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.PaymentConfirmationFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.PaymentConfirmationFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.PAYMENT_CONFIRMATION_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.PAYMENT_CONFIRMATION_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.PAYMENT_CONFIRMATION_FAILURE
    })
  }
}

export const getOrderController = async (req: Request<ParamsDictionary, any, GetOrderRequestsBody>, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const order = await orderOnlineService.getOrder(user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_SUCCESS,
      order
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_FAILURE
    })
  }
}

export const cancelOrderController = async (
  req: Request<ParamsDictionary, any, CancelOrderRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const order = req.order as Order
  const language = req.body.language || serverLanguage

  try {
    await orderOnlineService.cancelOrder(req.body, user, order)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CancelOrderSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.CancelOrderSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.CANCEL_ORDER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CANCEL_ORDER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CANCEL_ORDER_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CancelOrderFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.CancelOrderFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.CANCEL_ORDER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.CANCEL_ORDER_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CANCEL_ORDER_FAILURE
    })
  }
}

export const getOrderOverViewController = async (
  req: Request<ParamsDictionary, any, GetOrderRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const order = await orderOnlineService.getOrderOverview()

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_SUCCESS,
      order
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_FAILURE
    })
  }
}

export const getPaymentInfomationController = async (
  req: Request<ParamsDictionary, any, GetPaymentInfomationRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const order = req.order as Order
  const language = req.body.language || serverLanguage

  try {
    const infomation = await orderOnlineService.getPaymentInfomation(order)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetPaymentInfomationSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetPaymentInfomationSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_PAYMENT_INFOMATION_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_PAYMENT_INFOMATION_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_PAYMENT_INFOMATION_SUCCESS,
      infomation
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetPaymentInfomationFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetPaymentInfomationFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_PAYMENT_INFOMATION_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_PAYMENT_INFOMATION_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_PAYMENT_INFOMATION_FAILURE
    })
  }
}
