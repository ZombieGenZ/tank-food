import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { ParamsDictionary } from 'express-serve-static-core'
import { LANGUAGE } from '~/constants/language.constants'
import { RegisterUserRequestsBody, LoginUserRequestsBody } from '~/models/requests/users.requests'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { writeWarnLog } from '~/utils/log.utils'
import {
  VIETNAMESE_STATIC_MESSAGE,
  ENGLISH_STATIC_MESSAGE,
  VIETNAMESE_DYNAMIC_MESSAGE,
  ENGLIS_DYNAMIC_MESSAGE
} from '~/constants/message.constants'
import { serverLanguage } from '..'
import userService from '~/services/users.services'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import databaseService from '~/services/database.services'
import { HashPassword } from '~/utils/encryption.utils'
import { AuthenticateRequestsBody } from '~/models/requests/authenticate.requests'
import { verifyToken } from '~/utils/jwt.utils'
import { TokenPayload } from '~/models/requests/authentication.requests'
import accountManagementService from '~/services/accountManagement.services'
import User from '~/models/schemas/users.schemas'
import { UserTypeEnum } from '~/constants/users.constants'
import { ObjectId } from 'mongodb'
import { TokenType } from '~/constants/jwt.constants'

export const registerUserValidator = async (
  req: Request<ParamsDictionary, any, RegisterUserRequestsBody>,
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
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.DISPLAY_NAME_LENGTH_MUST_BE_FROM_1_TO_50
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.DISPLAY_NAME_LENGTH_MUST_BE_FROM_1_TO_50
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

export const loginUserValidator = async (
  req: Request<ParamsDictionary, any, LoginUserRequestsBody>,
  res: Response,
  next: NextFunction
) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
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
        isEmail: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.EMAIL_IS_NOT_VALID
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.EMAIL_IS_NOT_VALID
        },
        custom: {
          options: async (value, { req }) => {
            const result = await databaseService.users.findOne({
              email: value,
              password: HashPassword(req.body.password)
            })

            if (!result) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD
                  : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD
              )
            }

            if (result.penalty !== null) {
              const date = new Date()

              if (result.penalty.expired_at < date) {
                accountManagementService.unBan(result._id.toString())
              } else {
                throw new Error(
                  serverLanguage == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_DYNAMIC_MESSAGE.BanAccount(
                        result.display_name,
                        result.penalty.reason,
                        result.penalty.expired_at
                      )
                    : ENGLIS_DYNAMIC_MESSAGE.BanAccount(
                        result.display_name,
                        result.penalty.reason,
                        result.penalty.expired_at
                      )
                )
              }
            }

            ;(req as Request).user = result

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

export const verifyTokenValidator = async (
  req: Request<ParamsDictionary, any, AuthenticateRequestsBody>,
  res: Response,
  next: NextFunction
) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.REFRESH_TOKEN_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.REFRESH_TOKEN_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.REFRESH_TOKEN_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.REFRESH_TOKEN_MUST_BE_A_STRING
        },
        custom: {
          options: async (value, { req }) => {
            try {
              const decoded_refresh_token = (await verifyToken({
                token: value,
                publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
              })) as TokenPayload

              ;(req as Request).decoded_refresh_token = decoded_refresh_token

              const refresh_token = await databaseService.refreshToken.findOne({ token: value })

              if (!refresh_token) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.REFRESH_TOKEN_INVALID
                    : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.REFRESH_TOKEN_INVALID
                )
              }

              ;(req as Request).refresh_token = refresh_token

              const user = await databaseService.users.findOne({
                _id: refresh_token.user_id
              })

              if (!user) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.USER_DOES_NOT_EXIST
                    : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.USER_DOES_NOT_EXIST
                )
              }

              ;(req as Request).user = user
            } catch {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.REFRESH_TOKEN_INVALID
                  : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.REFRESH_TOKEN_INVALID
              )
            }

            return true
          }
        }
      }
    },
    ['headers', 'body']
  )
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        if (language == LANGUAGE.VIETNAMESE) {
          res.status(HTTPSTATUS.UNAUTHORIZED).json({
            code: RESPONSE_CODE.AUTHENTICATION_FAILED,
            message: VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.AUTHENTICATION_FAILED,
            errors: errors.mapped()
          })
          return
        } else {
          res.status(HTTPSTATUS.UNAUTHORIZED).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.AUTHENTICATION_FAILED,
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
      res.status(HTTPSTATUS.UNAUTHORIZED).json({
        code: RESPONSE_CODE.FATAL_AUTHENTICATION_FAILURE,
        message: err
      })
      return
    })
}

export const sendEmailVerifyValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage
  const user = req.user as User

  if (user.user_type === UserTypeEnum.VERIFIED) {
    res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
      code: RESPONSE_CODE.AUTHENTICATION_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.ACCOUNT_IS_VERIFIED
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.ACCOUNT_IS_VERIFIED
    })
    return
  }

  next()
}

export const verifyEmailVerifyTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.query.language || serverLanguage

  checkSchema(
    {
      token: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_MUST_BE_A_STRING
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

export const verifyAccountValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.query.language || serverLanguage

  checkSchema(
    {
      token: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_MUST_BE_A_STRING
        },
        custom: {
          options: async (value, { req }) => {
            try {
              const decoded_email_verify_token = (await verifyToken({
                token: value,
                publicKey: process.env.SECURITY_JWT_SECRET_EMAIL_VERIFY_TOKEN as string
              })) as TokenPayload

              if (!decoded_email_verify_token || decoded_email_verify_token.token_type !== TokenType.EmailVerifyToken) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_INVALID
                    : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_INVALID
                )
              }

              const user = await databaseService.users.findOne({
                _id: new ObjectId(decoded_email_verify_token.user_id),
                email_verify_token: value
              })

              if (!user) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_INVALID
                    : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_INVALID
                )
              }

              ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
              ;(req as Request).user = user
            } catch {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_INVALID
                  : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_INVALID
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

export const sendEmailForgotPasswordValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.EMAIL_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.EMAIL_IS_REQUIRED
        },
        trim: true,
        isEmail: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.EMAIL_IS_NOT_VALID
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.EMAIL_IS_NOT_VALID
        },
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: value })

            if (!user) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.EMAIL_NOT_FOUND
                  : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.EMAIL_NOT_FOUND
              )
            }

            ;(req as Request).user = user

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
        code: RESPONSE_CODE.FATAL_AUTHENTICATION_FAILURE,
        message: err
      })
      return
    })
}

export const verifyForgotPasswordTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.query.language || serverLanguage

  checkSchema(
    {
      token: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_MUST_BE_A_STRING
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

export const forgotPasswordValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.query.language || serverLanguage

  checkSchema(
    {
      token: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_MUST_BE_A_STRING
        },
        custom: {
          options: async (value, { req }) => {
            try {
              const decoded_forgot_password_token = (await verifyToken({
                token: value,
                publicKey: process.env.SECURITY_JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
              })) as TokenPayload

              if (!decoded_forgot_password_token || decoded_forgot_password_token.token_type !== TokenType.ForgotPasswordToken) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_INVALID
                    : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_INVALID
                )
              }

              const user = await databaseService.users.findOne({
                _id: new ObjectId(decoded_forgot_password_token.user_id),
                forgot_password_token: value
              })

              if (!user) {
                throw new Error(
                  language == LANGUAGE.VIETNAMESE
                    ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_INVALID
                    : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_INVALID
                )
              }

              ;(req as Request).decoded_forgot_password_token = decoded_forgot_password_token
              ;(req as Request).user = user
            } catch {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.TOKEN_INVALID
                  : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.TOKEN_INVALID
              )
            }

            return true
          }
        }
      },
      new_password: {
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
            min: 10,
            max: 11
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PHONE_LENGTH_MUST_BE_FROM_10_TO_11
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PHONE_LENGTH_MUST_BE_FROM_10_TO_11
        },
        isStrongPassword: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PASSWORD_MUST_BE_STRONG
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PASSWORD_MUST_BE_STRONG
        }
      },
      confirm_new_password: {
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
            if (value !== req.body.new_password) {
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

export const changeInformationValidator = async (req: Request, res: Response, next: NextFunction) => {
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
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.DISPLAY_NAME_LENGTH_MUST_BE_FROM_1_TO_50
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.DISPLAY_NAME_LENGTH_MUST_BE_FROM_1_TO_50
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

export const changePasswordValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.query.language || serverLanguage

  checkSchema(
    {
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
        custom: {
          options: async (value) => {
            const user = req.user as User

            if (HashPassword(value) !== user.password) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.INCORRECT_PASSWORD
                  : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.INCORRECT_PASSWORD
              )
            }

            return
          }
        }
      },
      new_password: {
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
            min: 10,
            max: 11
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PHONE_LENGTH_MUST_BE_FROM_10_TO_11
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PHONE_LENGTH_MUST_BE_FROM_10_TO_11
        },
        isStrongPassword: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.PASSWORD_MUST_BE_STRONG
              : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.PASSWORD_MUST_BE_STRONG
        }
      },
      confirm_new_password: {
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
            if (value !== req.body.new_password) {
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
            code: RESPONSE_CODE.AUTHENTICATION_FAILED,
            message: VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.AUTHENTICATION_FAILED,
            errors: errors.mapped()
          })
          return
        } else {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.AUTHENTICATION_FAILED,
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
        code: RESPONSE_CODE.FATAL_AUTHENTICATION_FAILURE,
        message: err
      })
      return
    })
}
