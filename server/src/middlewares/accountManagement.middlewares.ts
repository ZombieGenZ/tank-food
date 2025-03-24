import { Request, Response, NextFunction } from 'express'
import { serverLanguage } from '~/index'
import { checkSchema, validationResult } from 'express-validator'
import { LANGUAGE } from '~/constants/language.constants'
import { ENGLISH_STATIC_MESSAGE, VIETNAMESE_STATIC_MESSAGE } from '~/constants/message.constants'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { writeWarnLog } from '~/utils/log.utils'
import { calculateFutureTime } from '~/utils/date.utils'

export const banAccountValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      user_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_MUST_BE_A_ID
        },
        custom: {
          options: async (value) => {
            const user = await databaseService.users.findOne({ _id: new ObjectId(value) })

            if (!user) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_DOES_NOT_EXIST
              )
            }

            if (user.penalty !== null) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.ACCOUNT_HAS_BEEN_LOOKED
                  : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.ACCOUNT_HAS_BEEN_LOCKED
              )
            }

            return true
          }
        }
      },
      reason: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.BAN_USER_REASON_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.BAN_USER_REASON_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.BAN_USER_REASON_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.BAN_USER_REASON_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 300
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.BAN_USER_REASON_MUST_BE_FROM_1_TO_100
              : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.BAN_USER_REASON_MUST_BE_FROM_1_TO_100
        }
      },
      time: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.TIME_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.TIME_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.BAN_USER_TIME_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.BAN_USER_TIME_MUST_BE_A_STRING
        },
        custom: {
          options: (value) => {
            const time = calculateFutureTime(value)
            const date = new Date()

            console.log(time)

            if (!time) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.TIME_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.TIME_DOES_NOT_EXIST
              )
            }

            if (date > time) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.TIME_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.TIME_DOES_NOT_EXIST
              )
            }

            ;(req as Request).banned_time = time

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

export const unBanAccountValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      user_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_IS_MUST_BE_A_ID
        },
        custom: {
          options: async (value) => {
            const user = await databaseService.users.findOne({ _id: new ObjectId(value) })

            if (!user) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.USER_ID_DOES_NOT_EXIST
              )
            }

            if (user.penalty == null) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.ACCOUNT_IS_NOT_LOOKED
                  : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.ACCOUNT_IS_NOT_LOCKED
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
