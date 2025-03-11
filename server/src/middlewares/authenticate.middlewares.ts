import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import { ParamsDictionary } from 'express-serve-static-core'
import { LANGUAGE } from '~/constants/language.constants'
import { AuthenticateRequestsBody } from '~/models/requests/authenticate.requests'
import { serverLanguage } from '~/index'
import { VIETNAMESE_STATIC_MESSAGE, ENGLISH_STATIC_MESSAGE } from '~/constants/message.constants'
import { verifyToken } from '~/utils/jwt.utils'
import { TokenPayload } from '~/models/requests/authentication.requests'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import { writeWarnLog } from '~/utils/log.utils'
import User from '~/models/schemas/users.schemas'
import { UserRoleEnum } from '~/constants/users.constants'

export const authenticateValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      authorization: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.ACCESS_TOKEN_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.ACCESS_TOKEN_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.ACCESS_TOKEN_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.ACCESS_TOKEN_MUST_BE_A_STRING
        },
        custom: {
          options: async (value, { req }) => {
            const authorization = value.split(' ')

            if (authorization[0] !== 'Bearer') {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.ACCESS_TOKEN_INVALID
                  : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.ACCESS_TOKEN_INVALID
              )
            }

            if (authorization[1] === '') {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.ACCESS_TOKEN_INVALID
                  : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.ACCESS_TOKEN_INVALID
              )
            }

            try {
              console.log(authorization[1])

              const decoded_access_token = (await verifyToken({
                token: authorization[1],
                publicKey: process.env.SECURITY_JWT_SECRET_ACCESS_TOKEN as string
              })) as TokenPayload

              ;(req as Request).decoded_access_token = decoded_access_token

              const user = await databaseService.users.findOne({
                _id: new ObjectId(decoded_access_token.user_id)
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
              console.log('here')

              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.ACCESS_TOKEN_INVALID
                  : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.ACCESS_TOKEN_INVALID
              )
            }

            return true
          }
        }
      },
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

export const authenticateEmployeeValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage
  const user = req.user as User

  if (user.role !== UserRoleEnum.EMPLOYEE && user.role !== UserRoleEnum.ADMINISTRATOR) {
    res.status(HTTPSTATUS.UNAUTHORIZED).json({
      code: RESPONSE_CODE.AUTHENTICATION_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.YOU_DONT_HAVE_PERMISSION_TO_DO_THIS
          : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.YOU_DONT_HAVE_PERMISSION_TO_DO_THIS
    })
    return
  }

  next()
}

export const authenticateShipperValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage
  const user = req.user as User

  if (user.role !== UserRoleEnum.SHIPPER && user.role !== UserRoleEnum.ADMINISTRATOR) {
    res.status(HTTPSTATUS.UNAUTHORIZED).json({
      code: RESPONSE_CODE.AUTHENTICATION_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.YOU_DONT_HAVE_PERMISSION_TO_DO_THIS
          : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.YOU_DONT_HAVE_PERMISSION_TO_DO_THIS
    })
    return
  }

  next()
}

export const authenticateAdministratorValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage
  const user = req.user as User

  console.log(user.role)

  if (user.role !== UserRoleEnum.ADMINISTRATOR) {
    res.status(HTTPSTATUS.UNAUTHORIZED).json({
      code: RESPONSE_CODE.AUTHENTICATION_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.YOU_DONT_HAVE_PERMISSION_TO_DO_THIS
          : ENGLISH_STATIC_MESSAGE.AUTHENTICATE_MESSAGE.YOU_DONT_HAVE_PERMISSION_TO_DO_THIS
    })
    return
  }

  next()
}
