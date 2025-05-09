// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  CreateCategoryRequestsBody,
  UpdateCategoryRequestsBody,
  DeleteCategoryRequestsBody,
  GetCategoryRequestsBody
} from '~/models/requests/categories.requests'
import User from '~/models/schemas/users.schemas'
import { serverLanguage } from '~/index'
import categoryService from '~/services/categories.services'
import { writeInfoLog, writeErrorLog } from '~/utils/log.utils'
import { LANGUAGE } from '~/constants/language.constants'
import {
  VIETNAMESE_STATIC_MESSAGE,
  ENGLISH_STATIC_MESSAGE,
  VIETNAMESE_DYNAMIC_MESSAGE,
  ENGLIS_DYNAMIC_MESSAGE
} from '~/constants/message.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'

export const createCategoryController = async (
  req: Request<ParamsDictionary, any, CreateCategoryRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    await categoryService.create(req.body, user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CategoryCreateSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.CategoryCreateSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.CREATE_CATEGORY_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CREATE_CATEGORY_SUCCESS
          : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CREATE_CATEGORY_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CategoryCreateFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.CategoryCreateFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.CREATE_CATEGORY_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CREATE_CATEGORY_FAILURE
          : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CREATE_CATEGORY_FAILURE
    })
  }
}

export const updateCategoryController = async (
  req: Request<ParamsDictionary, any, UpdateCategoryRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    await categoryService.update(req.body, user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CategoryUpdateSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.CategoryUpdateSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.UPDATE_CATEGORY_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.UPDATE_CATEGORY_SUCCESS
          : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.UPDATE_CATEGORY_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CategoryUpdateFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.CategoryUpdateFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.UPDATE_CATEGORY_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.UPDATE_CATEGORY_FAILURE
          : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.UPDATE_CATEGORY_FAILURE
    })
  }
}

export const deleteCategoryController = async (
  req: Request<ParamsDictionary, any, DeleteCategoryRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    await categoryService.delete(req.body)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CategoryDeleteSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.CategoryDeleteSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.DELETE_CATEGORY_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.DELETE_CATEGORY_SUCCESS
          : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.DELETE_CATEGORY_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CategoryDeleteFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.CategoryDeleteFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.DELETE_CATEGORY_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.DELETE_CATEGORY_FAILURE
          : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.DELETE_CATEGORY_FAILURE
    })
  }
}

export const getCategoryController = async (
  req: Request<ParamsDictionary, any, GetCategoryRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const language = req.body.language || serverLanguage

  try {
    const categories = await categoryService.getCategory()

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetCategorySuccessfully(ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetCategorySuccessfully(ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_CATEGORY_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.GET_CATEGORY_SUCCESS
          : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.GET_CATEGORY_SUCCESS,
      categories
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetCategoryFailed(ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetCategoryFailed(ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_CATEGORY_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.GET_CATEGORY_FAILURE
          : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.GET_CATEGORY_FAILURE
    })
  }
}
