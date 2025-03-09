import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterUser } from '~/models/requests/users.requests'
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

export const registerUserController = async (req: Request<ParamsDictionary, any, RegisterUser>, res: Response) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const language = req.body.language || serverLanguage

  try {
    const authenticate = await userService.register(req.body)

    await writeInfoLog(
      language == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.UserRegistrationSuccessful(req.body.email, ip)
        : ENGLIS_DYNAMIC_MESSAGE.UserRegistrationSuccessful(req.body.email, ip)
    )

    res.json({
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.REGISTER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.REGISTER_SUCCESS,
      authenticate
    })
  } catch (err) {
    await writeErrorLog(
      language == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.UserRegistrationFailed(req.body.email, ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.UserRegistrationFailed(req.body.email, ip, err)
    )

    res.json({
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.USER_MESSAGE.REGISTER_FAILURE
          : ENGLISH_STATIC_MESSAGE.USER_MESSAGE.REGISTER_FAILURE
    })
  }
}
