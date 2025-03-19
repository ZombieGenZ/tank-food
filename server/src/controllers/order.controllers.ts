import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/users.schemas'
import {
  OrderOnlineRequestsBody,
  CheckoutOrderRequestBody,
  GetOrderRequestsBody,
  OrderApprovalRequestsBody
} from '~/models/requests/order.requests'
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
import { ProductList } from '~/constants/order.constants'
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
    const infomation = await orderOnlineService.checkout(req.body)

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
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.CHECKOUT_ORDER_SUCCESS,
      infomation
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
    const order = await orderOnlineService.getNewOrderEmployee()

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderEmployeeSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderEmployeeSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_EMPLOYEE_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_EMPLOYEE_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_EMPLOYEE_SUCCESS,
      order
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderEmployeeFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderEmployeeFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_EMPLOYEE_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_EMPLOYEE_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_EMPLOYEE_FAILURE
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
    const order = await orderOnlineService.getOldOrderEmployee()

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderEmployeeSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderEmployeeSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_EMPLOYEE_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_EMPLOYEE_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_EMPLOYEE_SUCCESS,
      order
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetOrderEmployeeFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetOrderEmployeeFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_ORDER_EMPLOYEE_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_EMPLOYEE_FAILURE
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.GET_ORDER_EMPLOYEE_FAILURE
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
    await orderOnlineService.OrderApproval(req.body, order, user, language)

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
