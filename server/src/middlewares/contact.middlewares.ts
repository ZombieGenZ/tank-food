import { Request, Response, NextFunction } from 'express'
import { serverLanguage } from '..'
import { checkSchema, validationResult } from 'express-validator'
import { LANGUAGE } from '~/constants/language.constants'
import { VIETNAMESE_STATIC_MESSAGE, ENGLISH_STATIC_MESSAGE } from '~/constants/message.constants'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import { writeWarnLog } from '~/utils/log.utils'

export const contactValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.NAME_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.NAME_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.NAME_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 5,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.NAME_LENGTH_MUST_BE_FROM_1_TO_50
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.NAME_LENGTH_MUST_BE_FROM_1_TO_50
        }
      },
      email: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.EMAIL_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.EMAIL_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.EMAIL_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.EMAIL_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 5,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.EMAIL_LENGTH_MUST_BE_FROM_5_TO_100
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.EMAIL_LENGTH_MUST_BE_FROM_5_TO_100
        },
        isEmail: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.EMAIL_IS_NOT_VALID
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.EMAIL_IS_NOT_VALID
        }
      },
      phone: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.PHONE_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.PHONE_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.PHONE_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.PHONE_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 10,
            max: 11
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.PHONE_LENGTH_MUST_BE_FROM_10_TO_11
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.PHONE_LENGTH_MUST_BE_FROM_10_TO_11
        },
        isMobilePhone: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.PHONE_IS_NOT_VALID
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.PHONE_IS_NOT_VALID
        }
      },
      title: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.TITLE_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.TITLE_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.TITLE_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.TITLE_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.TITLE_LENGTH_MUST_BE_FROM_1_TO_100
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.TITLE_LENGTH_MUST_BE_FROM_1_TO_100
        }
      },
      content: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.CONTENT_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.CONTENT_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.CONTENT_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.CONTENT_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 1000
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.CONTENT_LENGTH_MUST_BE_FROM_1_TO_1000
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.CONTENT_LENGTH_MUST_BE_FROM_1_TO_1000
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

export const discordApiKeyValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      Authorization: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.AUTH_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.AUTH_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.AUTH_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.AUTH_MUST_BE_A_STRING
        },
        custom: {
          options: (value) => {
            if (!value.startsWith('Apikey ')) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.INVALID_API_KEY
                  : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.INVALID_API_KEY
              )
            }

            if (value.split(' ')[1] !== process.env.DISCORD_RESPONSE_API_KEY) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.INVALID_API_KEY
                  : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.INVALID_API_KEY
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
