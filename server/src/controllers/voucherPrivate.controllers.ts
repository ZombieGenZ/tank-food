// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { GetVoucherPrivateRequestsBody } from '~/models/requests/voucherPrivate.requests'
import User from '~/models/schemas/users.schemas'
import { serverLanguage } from '~/index'
import voucherPrivateService from '~/services/voucherPrivate.services'
import { writeInfoLog, writeErrorLog } from '~/utils/log.utils'
import { LANGUAGE } from '~/constants/language.constants'
import {
  VIETNAMESE_STATIC_MESSAGE,
  ENGLISH_STATIC_MESSAGE,
  VIETNAMESE_DYNAMIC_MESSAGE,
  ENGLIS_DYNAMIC_MESSAGE
} from '~/constants/message.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'

export const getVoucherPrivateController = async (
  req: Request<ParamsDictionary, any, GetVoucherPrivateRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const { voucher_public, voucher_private } = await voucherPrivateService.getVoucher(user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetVoucherSuccessfully(ip)
        : ENGLIS_DYNAMIC_MESSAGE.GetVoucherSuccessfully(ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_VOUCHER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.GET_VOUCHER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.GET_VOUCHER_SUCCESS,
      voucher_public,
      voucher_private
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetVoucherFailed( ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.GetVoucherFailed(ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_VOUCHER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.GET_VOUCHER_FAILURE
          : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.GET_VOUCHER_FAILURE
    })
  }
}
