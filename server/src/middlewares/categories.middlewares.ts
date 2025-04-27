// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  CreateCategoryRequestsBody,
  UpdateCategoryRequestsBody,
  DeleteCategoryRequestsBody
} from '~/models/requests/categories.requests'
import { serverLanguage } from '~/index'
import { LANGUAGE } from '~/constants/language.constants'
import { VIETNAMESE_STATIC_MESSAGE, ENGLISH_STATIC_MESSAGE } from '~/constants/message.constants'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import { writeWarnLog } from '~/utils/log.utils'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

export const createCategoryValidator = async (
  req: Request<ParamsDictionary, any, CreateCategoryRequestsBody>,
  res: Response,
  next: NextFunction
) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      category_name: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_NAME_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_NAME_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_NAME_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_NAME_LENGTH_MUST_BE_FROM_1_TO_100
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_NAME_LENGTH_MUST_BE_FROM_1_TO_100
        }
      },
      index: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.INDEX_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.INDEX_IS_REQUIRED
        },
        trim: true,
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.INDEX_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.INDEX_MUST_BE_A_NUMBER
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        if (language == LANGUAGE.VIETNAMESE) {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: VIETNAMESE_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        } else {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: ENGLISH_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        }
      }
      next()
      return
    })
    .catch((err) => {
      writeWarnLog(typeof err === 'string' ? err : err instanceof Error ? err.message : String(err))
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.FATAL_INPUT_ERROR,
        message: err
      })
      return
    })
}

export const updateCategoryValidator = async (
  req: Request<ParamsDictionary, any, UpdateCategoryRequestsBody>,
  res: Response,
  next: NextFunction
) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      category_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_IS_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_IS_MUST_BE_A_ID
        },
        custom: {
          options: async (value) => {
            const category = await databaseService.categories.findOne({ _id: new ObjectId(value) })

            if (!category) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_DOES_NOT_EXIST
              )
            }

            return true
          }
        }
      },
      category_name: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_NAME_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_NAME_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_NAME_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_NAME_LENGTH_MUST_BE_FROM_1_TO_100
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_NAME_LENGTH_MUST_BE_FROM_1_TO_100
        }
      },
      index: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.INDEX_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.INDEX_IS_REQUIRED
        },
        trim: true,
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.INDEX_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.INDEX_MUST_BE_A_NUMBER
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        if (language == LANGUAGE.VIETNAMESE) {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: VIETNAMESE_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        } else {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: ENGLISH_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        }
      }
      next()
      return
    })
    .catch((err) => {
      writeWarnLog(typeof err === 'string' ? err : err instanceof Error ? err.message : String(err))
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.FATAL_INPUT_ERROR,
        message: err
      })
      return
    })
}

export const deleteCategoryValidator = async (
  req: Request<ParamsDictionary, any, DeleteCategoryRequestsBody>,
  res: Response,
  next: NextFunction
) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      category_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_IS_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_IS_MUST_BE_A_ID
        },
        custom: {
          options: async (value) => {
            const category = await databaseService.categories.findOne({ _id: new ObjectId(value) })

            if (!category) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.CATEGORY_MESSAGE.CATEGORY_ID_DOES_NOT_EXIST
              )
            }

            return true
          }
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        if (language == LANGUAGE.VIETNAMESE) {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: VIETNAMESE_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        } else {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: ENGLISH_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        }
      }
      next()
      return
    })
    .catch((err) => {
      writeWarnLog(typeof err === 'string' ? err : err instanceof Error ? err.message : String(err))
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.FATAL_INPUT_ERROR,
        message: err
      })
      return
    })
}
