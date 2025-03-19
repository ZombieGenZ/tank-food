import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/users.schemas'
import { OrderOnlineRequestsBody, CheckoutOrderRequestBody } from '~/models/requests/order.requests'
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
    const infomation = await orderOnlineService.order(req.body, user, total_quantity, total_price, product_list)

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
