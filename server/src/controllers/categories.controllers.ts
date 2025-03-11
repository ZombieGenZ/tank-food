import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateCategoryRequestsBody } from '~/models/requests/categories.requests'
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
    await categoryService.create(req.body)

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
