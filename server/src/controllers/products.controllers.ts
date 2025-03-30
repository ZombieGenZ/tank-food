import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  CreateProductRequestsBody,
  UpdateProductRequestsBody,
  DeleteProductRequestsBody,
  GetProductRequestsBody
} from '~/models/requests/products.requests'
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
import Product from '~/models/schemas/product.schemas'

export const createProductController = async (
  req: Request<ParamsDictionary, any, CreateProductRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage
  const image = req.image as ImageType

  try {
    await productService.create(req.body, image, user)

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

export const updateProductController = async (
  req: Request<ParamsDictionary, any, UpdateProductRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage
  const product = req.product as Product

  try {
    await productService.update(req.body, product, user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ProductUpdateSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.ProductUpdateSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.UPDATE_PRODUCT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.UPDATE_PRODUCT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.UPDATE_PRODUCT_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ProductUpdateFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.ProductUpdateFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.UPDATE_PRODUCT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.UPDATE_PRODUCT_FAILURE
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.UPDATE_PRODUCT_FAILURE
    })
  }
}

export const updateProductChangeImageController = async (
  req: Request<ParamsDictionary, any, UpdateProductRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage
  const product = req.product as Product
  const image = req.image as ImageType

  try {
    await productService.updateChangeImage(req.body, image, product, user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ProductUpdateSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.ProductUpdateSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.UPDATE_PRODUCT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.UPDATE_PRODUCT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.UPDATE_PRODUCT_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ProductUpdateFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.ProductUpdateFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.UPDATE_PRODUCT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.UPDATE_PRODUCT_FAILURE
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.UPDATE_PRODUCT_FAILURE
    })
  }
}

export const deleteProductController = async (
  req: Request<ParamsDictionary, any, DeleteProductRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage
  const product = req.product as Product

  try {
    await productService.delete(req.body, product)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ProductDeleteSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.ProductDeleteSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.DELETE_PRODUCT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.DELETE_PRODUCT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.DELETE_PRODUCT_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ProductDeleteFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.ProductDeleteFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.DELETE_PRODUCT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.DELETE_PRODUCT_FAILURE
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.DELETE_PRODUCT_FAILURE
    })
  }
}

export const getProductController = async (
  req: Request<ParamsDictionary, any, GetProductRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const language = req.body.language || serverLanguage

  try {
    const products = await productService.getProduct()

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetProductSuccessfully(ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetProductSuccessfully(ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_PRODUCT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.GET_PRODUCT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.GET_PRODUCT_SUCCESS,
      products
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetProductFailed(ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetProductFailed(ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_PRODUCT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.GET_PRODUCT_FAILURE
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.GET_PRODUCT_FAILURE
    })
  }
}

export const getProductListController = async (
  req: Request<ParamsDictionary, any, GetProductRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const language = req.body.language || serverLanguage
  const total_quantity = req.total_quantity
  const total_price = req.total_price
  const product_list = req.product_list

  try {
    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetProductSuccessfully(ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetProductSuccessfully(ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_PRODUCT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.GET_PRODUCT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.GET_PRODUCT_SUCCESS,
      infomation: {
        total_quantity,
        total_price,
        product_list
      }
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetProductFailed(ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetProductFailed(ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_PRODUCT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.GET_PRODUCT_FAILURE
          : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.GET_PRODUCT_FAILURE
    })
  }
}
