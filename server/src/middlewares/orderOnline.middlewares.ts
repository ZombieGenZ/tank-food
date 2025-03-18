import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { serverLanguage } from '..'
import { LANGUAGE } from '~/constants/language.constants'
import { VIETNAMESE_STATIC_MESSAGE, ENGLISH_STATIC_MESSAGE } from '~/constants/message.constants'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import { writeWarnLog } from '~/utils/log.utils'
import { ProductList } from '~/constants/order.constants'

export const orderOnlineValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      products: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_IS_REQUIRED
        },
        isArray: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_MUST_BE_AN_ARRAY
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_MUST_BE_AN_ARRAY
        },
        custom: {
          options: async (value: any) => {
            if (!Array.isArray(value) || value.length < 1) {
              console.log('here')
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_MUST_BE_AN_ARRAY
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_MUST_BE_AN_ARRAY
              )
            }

            const newProductList = []
            let total_quantity = 0
            let total_price = 0

            for (const item of value) {
              if (typeof item !== 'object' || item === null || Array.isArray(item)) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_IS_REQUIRED
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_IS_REQUIRED
                )
              }

              if (!item.product_id || !item.quantity) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_IS_REQUIRED
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_IS_REQUIRED
                )
              }

              if (typeof item.quantity !== 'number' || item.quantity <= 0) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_QUANTITY_MUST_BE_A_NUMBER_GREATER_THAN_0
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_QUANTITY_MUST_BE_A_NUMBER_GREATER_THAN_0
                )
              }

              const product = await databaseService.products.findOne({
                _id: new ObjectId(item.product_id)
              })

              if (!product) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_IS_NOT_FOUND
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_IS_NOT_FOUND
                )
              }

              if (!product.availability) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_IS_NOT_AVAILABLE
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PRODUCT_IS_NOT_AVAILABLE
                )
              }

              total_quantity += Number(item.quantity)
              total_price += Number(item.quantity) * product.price
              newProductList.push({
                product_id: product._id,
                quantity: item.quantity,
                price: Number(item.quantity) * product.price
              })
            }

            ;(req as Request).total_price = total_price
            ;(req as Request).total_quantity = total_quantity
            ;(req as Request).product_list = newProductList

            return true
          }
        }
      },
      name: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_NAME_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_NAME_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_NAME_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 5,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_NAME_MUST_BE_BETWEEN_5_AND_100_CHARACTERS
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_NAME_MUST_BE_BETWEEN_5_AND_100_CHARACTERS
        }
      },
      email: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_EMAIL_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_EMAIL_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_EMAIL_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_EMAIL_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 5,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_EMAIL_MUST_BE_BETWEEN_5_AND_100_CHARACTERS
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_EMAIL_MUST_BE_BETWEEN_5_AND_100_CHARACTERS
        },
        isEmail: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_EMAIL_IS_NOT_VALID
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_EMAIL_IS_NOT_VALID
        }
      },
      phone: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PHONE_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PHONE_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PHONE_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PHONE_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 10,
            max: 11
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PHONE_MUST_BE_BETWEEN_10_AND_11_CHARACTERS
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PHONE_MUST_BE_BETWEEN_10_AND_11_CHARACTERS
        },
        isMobilePhone: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PHONE_IS_NOT_VALID
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_PHONE_IS_NOT_VALID
        }
      },
      receiving_latitude: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_LATITUDE_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_LATITUDE_IS_REQUIRED
        },
        isFloat: {
          options: {
            min: -90,
            max: 90
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_LATITUDE_MUST_BE_A_NUMBER_BETWEEN_MINUS_90_AND_90
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_LATITUDE_MUST_BE_A_NUMBER_BETWEEN_MINUS_90_AND_90
        }
      },
      receiving_longitude: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_LONGITUDE_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_LONGITUDE_IS_REQUIRED
        },
        isFloat: {
          options: {
            min: -180,
            max: 180
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_LONGITUDE_MUST_BE_A_NUMBER_BETWEEN_MINUS_180_AND_180
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_LONGITUDE_MUST_BE_A_NUMBER_BETWEEN_MINUS_180_AND_180
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
