import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { ParamsDictionary } from 'express-serve-static-core'
import { LANGUAGE } from '~/constants/language.constants'
import { RegisterUser } from '~/models/requests/users.requests'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { writeWarnLog } from '~/utils/log.utils'
import { VIETNAMESE_STATIC_MESSAGE, ENGLISH_STATIC_MESSAGE } from '~/constants/message.constants'
import { serverLanguage } from '..'
import userService from '~/services/users.services'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'

export const registerUserValidator = async (
  req: Request<ParamsDictionary, any, RegisterUser>,
  res: Response,
  next: NextFunction
) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      display_name: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.DISPLAY_NAME_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.DISPLAY_NAME_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.DISPLAY_NAME_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.DISPLAY_NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 5,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.EMAIL_LENGTH_MUST_BE_FROM_5_TO_100
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.EMAIL_LENGTH_MUST_BE_FROM_5_TO_100
        }
      },
      email: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.EMAIL_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.EMAIL_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.EMAIL_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.EMAIL_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 5,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.EMAIL_LENGTH_MUST_BE_FROM_5_TO_100
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.EMAIL_LENGTH_MUST_BE_FROM_5_TO_100
        },
        isEmail: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.EMAIL_IS_NOT_VALID
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.EMAIL_IS_NOT_VALID
        },
        custom: {
          options: async (value) => {
            const result = await userService.checkEmailExits(value)

            if (result) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.EMAIL_ALREADY_EXISTS
                  : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.EMAIL_ALREADY_EXISTS
              )
            }

            return true
          }
        }
      },
      phone: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PHONE_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PHONE_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PHONE_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PHONE_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 10,
            max: 11
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PHONE_LENGTH_MUST_BE_FROM_10_TO_11
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PHONE_LENGTH_MUST_BE_FROM_10_TO_11
        },
        isMobilePhone: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PHONE_IS_NOT_VALID
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PHONE_IS_NOT_VALID
        },
        custom: {
          options: async (value) => {
            const result = await userService.checkPhoneExits(value)

            if (result) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PHONE_ALREADY_EXISTS
                  : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PHONE_ALREADY_EXISTS
              )
            }

            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PASSWORD_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PASSWORD_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PASSWORD_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100
        },
        isStrongPassword: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PASSWORD_MUST_BE_STRONG
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PASSWORD_MUST_BE_STRONG
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.CONFIRM_PASSWORD_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.CONFIRM_PASSWORD_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.CONFIRM_PASSWORD_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.CONFIRM_PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100
        },
        isStrongPassword: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRONG
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRONG
        },
        custom: {
          options: async (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.CONFIRM_PASSWORD_DOES_NOT_MATCH_PASSWORD
                  : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.CONFIRM_PASSWORD_DOES_NOT_MATCH_PASSWORD
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
