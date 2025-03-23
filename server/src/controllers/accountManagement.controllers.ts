import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { GetAccountRequestsBody } from '~/models/requests/accountManagement.requests'
import { serverLanguage } from '~/index'
import User from '~/models/schemas/users.schemas'
import { writeErrorLog, writeInfoLog } from '~/utils/log.utils'
import { LANGUAGE } from '~/constants/language.constants'
import accountManagementService from '~/services/accountManagement.services'
import {
  VIETNAMESE_STATIC_MESSAGE,
  ENGLISH_STATIC_MESSAGE,
  VIETNAMESE_DYNAMIC_MESSAGE,
  ENGLIS_DYNAMIC_MESSAGE
} from '~/constants/message.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'

export const getAccountManagementController = async (
  req: Request<ParamsDictionary, any, GetAccountRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const account = await accountManagementService.getAccount()

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.AccountManagementSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.AccountManagementSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_ACCOUNT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.GET_ACCOUNT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.GET_ACCOUNT_SUCCESS,
      account
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.AccountManagementFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.AccountManagementFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_ACCOUNT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.GET_ACCOUNT_FAILURE
          : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.GET_ACCOUNT_FAILURE
    })
  }
}
