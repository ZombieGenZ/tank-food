import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  RegisterUserRequestsBody,
  LoginUserRequestsBody,
  LogoutUserRequestsBody
} from '~/models/requests/users.requests'
import { serverLanguage } from '~/index'
import { writeInfoLog, writeErrorLog } from '~/utils/log.utils'
import { LANGUAGE } from '~/constants/language.constants'
import {
  VIETNAMESE_DYNAMIC_MESSAGE,
  ENGLIS_DYNAMIC_MESSAGE,
  VIETNAMESE_STATIC_MESSAGE,
  ENGLISH_STATIC_MESSAGE
} from '~/constants/message.constants'
import userService from '~/services/users.services'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import User from '~/models/schemas/users.schemas'
import RefreshToken from '~/models/schemas/refreshtoken.schemas'
import { AuthenticateRequestsBody } from '~/models/requests/authenticate.requests'
import { TokenPayload } from '~/models/requests/authentication.requests'
import { verifyToken } from '~/utils/jwt.utils'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { omit } from 'lodash'

export const registerUserController = async (
  req: Request<ParamsDictionary, any, RegisterUserRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const language = req.body.language || serverLanguage

  try {
    const authenticate = await userService.register(req.body, language)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.UserRegistrationSuccessful(req.body.email, ip)
        : ENGLIS_DYNAMIC_MESSAGE.UserRegistrationSuccessful(req.body.email, ip)
    )

    res.json({
      code: RESPONSE_CODE.USER_REGISTRATION_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.REGISTER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.REGISTER_SUCCESS,
      authenticate: {
        access_token: authenticate[0],
        refresh_token: authenticate[1]
      }
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.UserRegistrationFailed(req.body.email, ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.UserRegistrationFailed(req.body.email, ip, err)
    )

    res.json({
      code: RESPONSE_CODE.USER_REGISTRATION_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.REGISTER_FAILURE
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.REGISTER_FAILURE
    })
  }
}

export const loginUserController = async (
  req: Request<ParamsDictionary, any, LoginUserRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const authenticate = await userService.login(user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.UserLoggedInSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.UserLoggedInSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.USER_LOGIN_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.LOGIN_SUCCESS
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.LOGIN_SUCCESS,
      authenticate: {
        access_token: authenticate[0],
        refresh_token: authenticate[1]
      }
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.UserLoggedInFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.UserLoggedInFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.USER_LOGIN_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.LOGIN_FAILURE
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.LOGIN_FAILURE
    })
  }
}

export const logoutUserController = async (
  req: Request<ParamsDictionary, any, LogoutUserRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const refresh_token = req.refresh_token as RefreshToken
  const language = req.body.language || serverLanguage

  try {
    await userService.logout(refresh_token.token)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.UserLoggedOutSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.UserLoggedOutSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.USER_LOGOUT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.LOGOUT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.LOGOUT_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.UserLoggedOutFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.UserLoggedOutFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.USER_LOGOUT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.LOGOUT_FAILURE
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.LOGOUT_FAILURE
    })
  }
}

export const verifyTokenUserController = async (
  req: Request<ParamsDictionary, any, AuthenticateRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const access_token = req.headers.authorization || null
  const refresh_token = req.refresh_token as RefreshToken
  const language = req.body.language || serverLanguage

  try {
    const access = access_token?.split(' ')
    let changed: boolean
    let result: {
      access_token: string
      refresh_token: string
    }
    if (!access || access[0] !== 'Bearer' || access[1] == '') {
      const authenticate = await userService.signAccessTokenAndRefreshToken(refresh_token.user_id.toString())

      await userService.updateRefreshToken(refresh_token.token, authenticate[1])

      result = {
        access_token: authenticate[0],
        refresh_token: authenticate[1]
      }

      changed = true
    } else {
      try {
        const decoded_access_token = (await verifyToken({
          token: access[1],
          publicKey: process.env.SECURITY_JWT_SECRET_ACCESS_TOKEN as string
        })) as TokenPayload

        const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_access_token.user_id) })

        if (!decoded_access_token || !user) {
          const authenticate = await userService.signAccessTokenAndRefreshToken(refresh_token.user_id.toString())

          await userService.updateRefreshToken(refresh_token.token, authenticate[1])

          result = {
            access_token: authenticate[0],
            refresh_token: authenticate[1]
          }

          changed = true
        } else {
          result = {
            access_token: access[1],
            refresh_token: refresh_token.token
          }

          changed = false
        }
      } catch {
        const authenticate = await userService.signAccessTokenAndRefreshToken(refresh_token.user_id.toString())

        await userService.updateRefreshToken(refresh_token.token, authenticate[1])

        result = {
          access_token: authenticate[0],
          refresh_token: authenticate[1]
        }

        changed = true
      }
    }

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.UserVerifyTokenSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.UserVerifyTokenSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: changed
        ? RESPONSE_CODE.TOKEN_AUTHENTICATION_SUCCESSFUL_TOKEN_CHANGED
        : RESPONSE_CODE.TOKEN_VERIFICATION_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.VERIFY_TOKEN_SUCCESS
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.VERIFY_TOKEN_SUCCESS,
      authenticate: result
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.UserVerifyTokenFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.UserVerifyTokenFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.TOKEN_VERIFICATION_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.VERIFY_TOKEN_FAILURE
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.VERIFY_TOKEN_FAILURE
    })
  }
}

export const getUserInfomationController = async (
  req: Request<ParamsDictionary, any, AuthenticateRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetUserInformationSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetUserInformationSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_USER_INFOMATION_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.GET_USER_INFORMATION_SUCCESS
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.GET_USER_INFORMATION_SUCCESS,
      infomation: omit(user, ['password', 'email_verify_token', 'forgot_password_token'])
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetUserInformationFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetUserInformationFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_USER_INFOMATION_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.GET_USER_INFORMATION_FAILURE
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.GET_USER_INFORMATION_FAILURE
    })
  }
}
