import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { LANGUAGE } from '~/constants/language.constants'
import { ENGLISH_STATIC_MESSAGE, VIETNAMESE_STATIC_MESSAGE } from '~/constants/message.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import { serverLanguage } from '~/index'
import databaseService from '~/services/database.services'
import { writeWarnLog } from '~/utils/log.utils'

export const createVoucherValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      code: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_MUST_BE_A_STRING
        },
        matches: {
          options: /^[a-zA-Z0-9_]+$/,
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_MUST_BE_A_STRING_WITHOUT_SPECIAL_CHARACTERS
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_MUST_BE_A_STRING_WITHOUT_SPECIAL_CHARACTERS
        },
        isLength: {
          options: {
            min: 1,
            max: 50
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_LENGTH_MUST_BE_FROM_1_TO_50
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_LENGTH_MUST_BE_FROM_1_TO_50
        },
        custom: {
          options: async (value) => {
            const [voucherPublic, voucherPrivate] = await Promise.all([
              databaseService.voucherPublic.findOne({ code: value }),
              databaseService.voucherPrivate.findOne({ code: value })
            ])

            if (voucherPublic || voucherPrivate) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_ALREADY_EXISTS
                  : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_ALREADY_EXISTS
              )
            }

            return true
          }
        }
      },
      quantity: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_QUANTITY_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_QUANTITY_IS_REQUIRED
        },
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_QUANTITY_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_QUANTITY_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_QUANTITY_MUST_BE_GREATER_THAN_0
                  : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_QUANTITY_MUST_BE_GREATER_THAN_0
              )
            }

            return true
          }
        }
      },
      discount: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_DISCOUNT_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_DISCOUNT_IS_REQUIRED
        },
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_DISCOUNT_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_DISCOUNT_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_DISCOUNT_MUST_BE_GREATER_THAN_0
                  : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_DISCOUNT_MUST_BE_GREATER_THAN_0
              )
            }

            return true
          }
        }
      },
      requirement: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_REQUIREMENT_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_REQUIREMENT_IS_REQUIRED
        },
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_REQUIREMENT_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_REQUIREMENT_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_REQUIREMENT_MUST_BE_GREATER_THAN_0
                  : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_REQUIREMENT_MUST_BE_GREATER_THAN_0
              )
            }
            return true
          }
        }
      },
      expiration_date: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_EXPIRATION_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_EXPIRATION_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_EXPIRATION_IS_NOT_VALID
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_EXPIRATION_IS_NOT_VALID
        },
        custom: {
          options: (value) => {
            const valueDate = new Date(value)
            const currentDate = new Date()

            if (currentDate > valueDate) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_EXPIRATION_MUST_BE_GREATER_THAN_CURRENT_DATE
                  : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_EXPIRATION_MUST_BE_GREATER_THAN_CURRENT_DATE
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
    .then(async () => {
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
    .catch(async (err) => {
      await Promise.all([
        writeWarnLog(typeof err === 'string' ? err : err instanceof Error ? err.message : String(err))
      ])
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.FATAL_INPUT_ERROR,
        message: err
      })
      return
    })
}

export const updateVoucherValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      voucher_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_ID_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_ID_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_ID_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_ID_MUST_BE_A_ID
        },
        custom: {
          options: async (value) => {
            const voucher = await databaseService.voucherPublic.findOne({ _id: new ObjectId(value) })

            if (!voucher) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_DOES_NOT_EXIST
              )
            }

            return true
          }
        }
      },
      code: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_MUST_BE_A_STRING
        },
        matches: {
          options: /^[a-zA-Z0-9_]+$/,
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_MUST_BE_A_STRING_WITHOUT_SPECIAL_CHARACTERS
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_MUST_BE_A_STRING_WITHOUT_SPECIAL_CHARACTERS
        },
        isLength: {
          options: {
            min: 1,
            max: 50
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_LENGTH_MUST_BE_FROM_1_TO_50
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_LENGTH_MUST_BE_FROM_1_TO_50
        },
        custom: {
          options: async (value) => {
            const [voucherPublic, voucherPrivate] = await Promise.all([
              databaseService.voucherPublic.findOne({ code: value }),
              databaseService.voucherPrivate.findOne({ code: value })
            ])

            if (voucherPublic || voucherPrivate) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_ALREADY_EXISTS
                  : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.CODE_ALREADY_EXISTS
              )
            }

            return true
          }
        }
      },
      quantity: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_QUANTITY_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_QUANTITY_IS_REQUIRED
        },
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_QUANTITY_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_QUANTITY_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_QUANTITY_MUST_BE_GREATER_THAN_0
                  : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_QUANTITY_MUST_BE_GREATER_THAN_0
              )
            }

            return true
          }
        }
      },
      discount: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_DISCOUNT_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_DISCOUNT_IS_REQUIRED
        },
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_DISCOUNT_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_DISCOUNT_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_DISCOUNT_MUST_BE_GREATER_THAN_0
                  : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_DISCOUNT_MUST_BE_GREATER_THAN_0
              )
            }

            return true
          }
        }
      },
      requirement: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_REQUIREMENT_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_REQUIREMENT_IS_REQUIRED
        },
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_REQUIREMENT_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_REQUIREMENT_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value < 0) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_REQUIREMENT_MUST_BE_GREATER_THAN_0
                  : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_REQUIREMENT_MUST_BE_GREATER_THAN_0
              )
            }
            return true
          }
        }
      },
      expiration_date: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_EXPIRATION_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_EXPIRATION_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_EXPIRATION_IS_NOT_VALID
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_EXPIRATION_IS_NOT_VALID
        },
        custom: {
          options: (value) => {
            const valueDate = new Date(value)
            const currentDate = new Date()

            if (currentDate > valueDate) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_EXPIRATION_MUST_BE_GREATER_THAN_CURRENT_DATE
                  : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.PRODUCT_EXPIRATION_MUST_BE_GREATER_THAN_CURRENT_DATE
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
    .then(async () => {
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
    .catch(async (err) => {
      await Promise.all([
        writeWarnLog(typeof err === 'string' ? err : err instanceof Error ? err.message : String(err))
      ])
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.FATAL_INPUT_ERROR,
        message: err
      })
      return
    })
}

export const deleteVoucherValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      voucher_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_ID_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_ID_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_ID_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_ID_MUST_BE_A_ID
        },
        custom: {
          options: async (value) => {
            const voucher = await databaseService.voucherPublic.findOne({ _id: new ObjectId(value) })

            if (!voucher) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.VOUCHER_DOES_NOT_EXIST
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
    .then(async () => {
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
    .catch(async (err) => {
      await Promise.all([
        writeWarnLog(typeof err === 'string' ? err : err instanceof Error ? err.message : String(err))
      ])
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.FATAL_INPUT_ERROR,
        message: err
      })
      return
    })
}

export const findVoucherValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      keywords: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.KEYWORD_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.KEYWORD_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.KEYWORD_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.KEYWORD_MUST_BE_A_STRING
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
