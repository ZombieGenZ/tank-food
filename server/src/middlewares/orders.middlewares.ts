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
import voucherPrivateService from '~/services/voucherPrivate.services'
import voucherPublicService from '~/services/voucherPublic.services'
import User from '~/models/schemas/users.schemas'
import { UserRoleEnum } from '~/constants/users.constants'
import { DeliveryTypeEnum, OrderStatusEnum, PaymentStatusEnum, PaymentTypeEnum } from '~/constants/orders.constants'

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

export const voucherPublicAndPrivateValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  const voucher = req.body.voucher

  if (!voucher) {
    next()
    return
  }

  if (typeof voucher != 'string') {
    next()
    return
  }

  const voucherPrivate = await databaseService.voucherPrivate.findOne({ code: voucher })
  const voucherPublic = await databaseService.voucherPublic.findOne({ code: voucher })

  if (!voucherPublic && !voucherPrivate) {
    res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
      code: RESPONSE_CODE.VOUCHER_INVALID,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.VOUCHER_IS_NOT_FOUND
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.VOUCHER_IS_NOT_FOUND
    })
    return
  }

  if (voucherPrivate) {
    const total_price = req.total_price as number

    const new_bill = total_price - voucherPrivate.discount

    req.total_price = new_bill > 0 ? new_bill : 0

    await voucherPrivateService.useVoucher(voucherPrivate)

    next()
    return
  }

  if (voucherPublic) {
    const total_price = req.total_price as number

    if (voucherPublic.requirement > total_price) {
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.VOUCHER_INVALID,
        message:
          language == LANGUAGE.VIETNAMESE
            ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.VOUCHER_REQUIREMENT_IS_NOT_MET
            : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.VOUCHER_REQUIREMENT_IS_NOT_MET
      })
      return
    }

    const new_bill = total_price - voucherPublic.discount

    req.total_price = new_bill > 0 ? new_bill : 0

    await voucherPublicService.useVoucher(voucherPublic)

    next()
    return
  }
}

export const sepayApiKeyValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = serverLanguage

  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.API_KEY_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.API_KEY_REQUIRED
        },
        custom: {
          options: (value) => {
            if (!value.startsWith('Apikey ')) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.API_KEY_INVALID
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.API_KEY_INVALID
              )
            }

            if (value.split(' ')[1] !== process.env.SEPAY_API_KEY) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.API_KEY_INVALID
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.API_KEY_INVALID
              )
            }

            return true
          }
        }
      }
    },
    ['headers']
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

export const orderApprovalValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      order_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const order = await databaseService.order.findOne({ _id: new ObjectId(value) })

            if (!order) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
              )
            }

            if (order.payment_status !== PaymentStatusEnum.PAID) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_UNPAID
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_UNPAID
              )
            }

            const user = (req as Request).user as User

            if (user.role !== UserRoleEnum.ADMINISTRATOR) {
              if (order.user && order.user.equals(user._id)) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                )
              }

              if (order.order_status !== OrderStatusEnum.PENDING) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_APPROVED
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_APPROVED
                )
              }
            }

            ;(req as Request).order = order

            return true
          }
        }
      },
      decision: {
        isBoolean: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.DECISION_MUST_BE_A_BOOLEAN
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.DECISION_MUST_BE_A_BOOLEAN
        },
        custom: {
          options: (value, { req }) => {
            if (!value) {
              const reason = req.body.reason

              if (!reason) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.REASON_IS_REQUIRED
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.REASON_IS_REQUIRED
                )
              }

              if (reason.length < 5 || reason.length > 200) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.REASON_MUST_BE_BETWEEN_5_AND_200_CHARACTERS
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.REASON_MUST_BE_BETWEEN_5_AND_200_CHARACTERS
                )
              }
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

export const cancelOrderEmployeeValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      order_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const order = await databaseService.order.findOne({ _id: new ObjectId(value) })

            if (!order) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
              )
            }

            const user = (req as Request).user as User

            if (order.order_status === OrderStatusEnum.CANCELED) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_CANCELED
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_CANCELED
              )
            }

            if (user.role !== UserRoleEnum.ADMINISTRATOR) {
              if (order.user && order.user.equals(user._id)) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                )
              }

              if (order.moderated_by && !order.moderated_by.equals(user._id)) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                )
              }

              if (order.order_status === OrderStatusEnum.PENDING) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_NOT_APPROVED
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_NOT_APPROVED
                )
              }
            }

            ;(req as Request).order = order

            return true
          }
        }
      },
      reason: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.REASON_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.REASON_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.REASON_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.REASON_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 5,
            max: 200
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.REASON_MUST_BE_BETWEEN_5_AND_200_CHARACTERS
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.REASON_MUST_BE_BETWEEN_5_AND_200_CHARACTERS
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

export const orderCompletionConfirmationValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      order_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const order = await databaseService.order.findOne({ _id: new ObjectId(value) })

            if (!order) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
              )
            }

            if (order.delivery_type == DeliveryTypeEnum.DELIVERY) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_IS_NOT_OFFLINE_ORDER
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_IS_NOT_OFFLINE_ORDER
              )
            }

            if (order.payment_status !== PaymentStatusEnum.PAID) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_UNPAID
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_UNPAID
              )
            }

            if (order.order_status !== OrderStatusEnum.CONFIRMED) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_NOT_APPROVED
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_NOT_APPROVED
              )
            }

            ;(req as Request).order = order

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

export const receiveDeliveryValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      order_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const order = await databaseService.order.findOne({ _id: new ObjectId(value) })

            if (!order) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
              )
            }

            if (order.order_status !== OrderStatusEnum.CONFIRMED || order.shipper !== null) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
              )
            }

            const user = (req as Request).user as User

            if (user.role !== UserRoleEnum.ADMINISTRATOR) {
              if (order.user && order.user.equals(user._id)) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                )
              }
            }

            ;(req as Request).order = order

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

export const cancelOrderShipperValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      order_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const order = await databaseService.order.findOne({ _id: new ObjectId(value) })

            if (!order) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
              )
            }

            const user = (req as Request).user as User

            if (order.payment_status !== PaymentStatusEnum.PAID) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_UNPAID
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_UNPAID
              )
            }

            if (order.shipper && order.shipper.equals(user._id)) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
              )
            }

            if (user.role !== UserRoleEnum.ADMINISTRATOR) {
              if (order.user && order.user.equals(user._id)) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                )
              }

              if (order.order_status !== OrderStatusEnum.DELIVERING) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                )
              }
            }

            ;(req as Request).order = order

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

export const orderOfflineValidator = async (req: Request, res: Response, next: NextFunction) => {
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
      payment_type: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.PAYMENT_TYPE_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.PAYMENT_TYPE_IS_REQUIRED
        },
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.PAYMENT_TYPE_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.PAYMENT_TYPE_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value in PaymentTypeEnum) {
              return true
            }
            throw new Error(
              language == LANGUAGE.VIETNAMESE
                ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.PAYMENT_TYPE_IS_NOT_VALID
                : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.PAYMENT_TYPE_IS_NOT_VALID
            )
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

export const paymentConfirmationValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      order_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const order = await databaseService.order.findOne({ _id: new ObjectId(value) })

            if (!order) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
              )
            }

            if (order.payment_type === PaymentTypeEnum.BANK) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
              )
            }

            const user = (req as Request).user as User

            if (user.role !== UserRoleEnum.ADMINISTRATOR) {
              if (order.user && order.user.equals(user._id)) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                    : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                )
              }
            }

            ;(req as Request).order = order

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

export const voucherPublicValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  const voucher = req.body.voucher

  if (!voucher) {
    next()
    return
  }

  if (typeof voucher != 'string') {
    next()
    return
  }

  const voucherPublic = await databaseService.voucherPublic.findOne({ code: voucher })

  if (!voucherPublic) {
    res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
      code: RESPONSE_CODE.VOUCHER_INVALID,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.VOUCHER_IS_NOT_FOUND
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.VOUCHER_IS_NOT_FOUND
    })
    return
  }

  const total_price = req.total_price as number

  if (voucherPublic.requirement > total_price) {
    res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
      code: RESPONSE_CODE.VOUCHER_INVALID,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.VOUCHER_REQUIREMENT_IS_NOT_MET
          : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.VOUCHER_REQUIREMENT_IS_NOT_MET
    })
    return
  }

  const new_bill = total_price - voucherPublic.discount

  req.total_price = new_bill > 0 ? new_bill : 0

  await voucherPublicService.useVoucher(voucherPublic)

  next()
}

export const confirmDeliveryCompletionValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      order_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_MUST_BE_A_ID
        },
        custom: {
          options: async (value, { req }) => {
            const order = await databaseService.order.findOne({ _id: new ObjectId(value) })

            if (!order) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
              )
            }

            if (order.delivery_type == DeliveryTypeEnum.COUNTER) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_IS_NOT_ONLINE_ORDER
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_IS_NOT_ONLINE_ORDER
              )
            }

            if (order.order_status === OrderStatusEnum.CONFIRMED) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_NOT_DELIVERED
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_NOT_DELIVERED
              )
            }

            if (order.order_status !== OrderStatusEnum.DELIVERING) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_ID_DOES_NOT_EXIST
              )
            }

            const user = (req as Request).user as User

            if (order.shipper && !order.shipper.equals(user._id)) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_DELIVERY_PERSON_MISMATCH
                  : ENGLISH_STATIC_MESSAGE.ORDER_MESSAGE.ORDER_DELIVERY_PERSON_MISMATCH
              )
            }

            ;(req as Request).order = order

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
