import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  CreateVoucherRequestsBody,
  UpdateVoucherRequestsBody,
  DeleteVoucherRequestsBody,
  GetVoucherPublicRequestsBody
} from '~/models/requests/voucherPublic.requests'
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

export const createVoucherPublicController = async (
  req: Request<ParamsDictionary, any, CreateVoucherRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    await voucherPublicService.create(req.body, user)

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

export const updateVoucherPublicController = async (
  req: Request<ParamsDictionary, any, UpdateVoucherRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    await voucherPublicService.update(req.body, user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.VoucherUpdateSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.VoucherUpdateSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.UPDATE_VOUCHER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.UPDATE_VOUCHER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.UPDATE_VOUCHER_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.VoucherUpdateFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.VoucherUpdateFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.UPDATE_VOUCHER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.UPDATE_VOUCHER_FAILURE
          : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.UPDATE_VOUCHER_FAILURE
    })
  }
}

export const deleteVoucherPublicController = async (
  req: Request<ParamsDictionary, any, DeleteVoucherRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    await voucherPublicService.delete(req.body)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.VoucherDeleteSuccessfully(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.VoucherDeleteSuccessfully(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.DELETE_VOUCHER_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.DELETE_VOUCHER_SUCCESS
          : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.DELETE_VOUCHER_SUCCESS
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.VoucherDeleteFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.VoucherDeleteFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.DELETE_VOUCHER_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.VOUCHER_MESSAGE.DELETE_VOUCHER_FAILURE
          : ENGLISH_STATIC_MESSAGE.VOUCHER_MESSAGE.DELETE_VOUCHER_FAILURE
    })
  }
}

export const getVoucherPublicController = async (
  req: Request<ParamsDictionary, any, GetVoucherPublicRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const language = req.body.language || serverLanguage

  try {
    const voucher = await voucherPublicService.getVoucher()

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
      voucher
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.GetVoucherFailed(ip, err)
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
