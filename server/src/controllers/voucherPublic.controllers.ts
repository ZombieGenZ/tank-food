import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateVoucherRequestsBody } from '~/models/requests/voucherPublic.requests'
import { serverLanguage } from '~/index'
import User from '~/models/schemas/users.schemas'
import { LANGUAGE } from '~/constants/language.constants'
import voucherPublicService from '~/services/voucherPublic.services'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import {
  VIETNAMESE_STATIC_MESSAGE,
  ENGLISH_STATIC_MESSAGE,
  VIETNAMESE_DYNAMIC_MESSAGE,
  ENGLIS_DYNAMIC_MESSAGE
} from '~/constants/message.constants'
import { writeInfoLog, writeErrorLog } from '~/utils/log.utils'

export const createVoucherController = async (
  req: Request<ParamsDictionary, any, CreateVoucherRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    await voucherPublicService.create(req.body)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.VoucherCreateSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.VoucherCreateSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.CREATE_VOUCHER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.CREATE_VOUCHER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.CREATE_VOUCHER_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.VoucherCreateFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.VoucherCreateFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.CREATE_VOUCHER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.CREATE_VOUCHER_FAILURE
          : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.CREATE_VOUCHER_FAILURE
    })
  }
}
