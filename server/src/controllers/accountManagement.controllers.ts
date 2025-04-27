// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  GetAccountRequestsBody,
  BanAccountRequestsBody,
  UnBanAccountRequestsBody
} from '~/models/requests/accountManagement.requests'
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

export const banAccountManagementController = async (
  req: Request<ParamsDictionary, any, BanAccountRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage
  const banned_time = req.banned_time as Date

  try {
    const account = await accountManagementService.ban(req.body, banned_time, user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.BanAccountManagementSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.BanAccountManagementSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.BAN_ACCOUNT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.BAN_ACCOUNT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.BAN_ACCOUNT_SUCCESS,
      account
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.BanAccountManagementFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.BanAccountManagementFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.BAN_ACCOUNT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.BAN_ACCOUNT_FAILURE
          : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.BAN_ACCOUNT_FAILURE
    })
  }
}

export const unBanAccountManagementController = async (
  req: Request<ParamsDictionary, any, UnBanAccountRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const account = await accountManagementService.unBan(req.body.user_id)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.UnBanAccountManagementSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.UnBanAccountManagementSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.UNBAN_ACCOUNT_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.UNBAN_ACCOUNT_SUCCESS
          : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.UNBAN_ACCOUNT_SUCCESS,
      account
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.UnBanAccountManagementFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.UnBanAccountManagementFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.UNBAN_ACCOUNT_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.UNBAN_ACCOUNT_FAILURE
          : ENGLISH_STATIC_MESSAGE.ACCOUNT_MANAGEMENT_MESSAGE.UNBAN_ACCOUNT_FAILURE
    })
  }
}
