import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateProductRequestsBody } from '~/models/requests/products.requests'
import User from '~/models/schemas/users.schemas'
import { serverLanguage } from '~/index'
import productService from '~/services/products.services'
import { writeInfoLog, writeErrorLog } from '~/utils/log.utils'
import { LANGUAGE } from '~/constants/language.constants'
import {
  VIETNAMESE_STATIC_MESSAGE,
  ENGLISH_STATIC_MESSAGE,
  VIETNAMESE_DYNAMIC_MESSAGE,
  ENGLIS_DYNAMIC_MESSAGE
} from '~/constants/message.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import { ImageType } from '~/constants/images.constants'

export const createProductController = async (
  req: Request<ParamsDictionary, any, CreateProductRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage
  const image = req.image as ImageType

  try {
    await productService.create(req.body, image)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ProductCreateSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.ProductCreateSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.CREATE_PRODUCT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.CREATE_PRODUCT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.CREATE_PRODUCT_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ProductCreateFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.ProductCreateFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.CREATE_PRODUCT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.CREATE_PRODUCT_FAILURE
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.CREATE_PRODUCT_FAILURE
    })
  }
}
