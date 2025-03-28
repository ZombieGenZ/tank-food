import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { serverLanguage } from '~/index'
import { writeInfoLog, writeErrorLog } from '~/utils/log.utils'
import { SendContactRequestsBody, ResponseContactRequestsBody } from '~/models/requests/contact.requests'
import { LANGUAGE } from '~/constants/language.constants'
import {
  VIETNAMESE_STATIC_MESSAGE,
  ENGLISH_STATIC_MESSAGE,
  VIETNAMESE_DYNAMIC_MESSAGE,
  ENGLIS_DYNAMIC_MESSAGE
} from '~/constants/message.constants'
import contactService from '~/services/contact.services'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'

export const contactController = async (
  req: Request<ParamsDictionary, any, SendContactRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const language = req.body.language || serverLanguage

  try {
    await contactService.send(req.body)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.SendContactSuccessful(ip)
        : ENGLIS_DYNAMIC_MESSAGE.SendContactSuccessful(ip)
    )

    res.json({
      code: RESPONSE_CODE.SEND_CONTACT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.SEND_CONTACT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.SEND_CONTACT_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.SendContactFailed(ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.SendContactFailed(ip, err)
    )

    res.json({
      code: RESPONSE_CODE.SEND_CONTACT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.SEND_CONTACT_FAILURE
          : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.SEND_CONTACT_FAILURE
    })
  }
}

export const responseContactController = async (
  req: Request<ParamsDictionary, any, ResponseContactRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const language = req.body.language || serverLanguage

  try {
    await contactService.response(req.body)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.responseContactSuccessful(ip)
        : ENGLIS_DYNAMIC_MESSAGE.responseContactSuccessful(ip)
    )

    res.json({
      code: RESPONSE_CODE.RESPONSE_CONTACT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.RESPONSE_CONTACT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.RESPONSE_CONTACT_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.responseContactFailed(ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.responseContactFailed(ip, err)
    )

    res.json({
      code: RESPONSE_CODE.RESPONSE_CONTACT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.CONTACT_MESSAGE.RESPONSE_CONTACT_FAILURE
          : ENGLISH_STATIC_MESSAGE.CONTACT_MESSAGE.RESPONSE_CONTACT_FAILURE
    })
  }
}
