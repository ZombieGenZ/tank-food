// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { serverLanguage } from '~/index'
import { writeErrorLog, writeInfoLog } from '~/utils/log.utils'
import { StatisticalRequestsBody } from '~/models/requests/statistical.requests'
import { LANGUAGE } from '~/constants/language.constants'
import statisticalService from '~/services/statistical.services'
import {
  ENGLIS_DYNAMIC_MESSAGE,
  ENGLISH_STATIC_MESSAGE,
  VIETNAMESE_DYNAMIC_MESSAGE,
  VIETNAMESE_STATIC_MESSAGE
} from '~/constants/message.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import User from '~/models/schemas/users.schemas'
import { formatNumber } from '~/utils/number.utils'
import { formatDateFull } from '~/utils/date.utils'

export const statisticalOverviewController = async (
  req: Request<ParamsDictionary, any, StatisticalRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const statistical = await statisticalService.overview(req.body.time)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.StatisticalOverviewSuccessful(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.StatisticalOverviewSuccessful(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.STATICSTICAL_OVERVIEW_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_SUCCESS
          : ENGLISH_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_SUCCESS,
      statistical
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.StatisticalOverviewFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.StatisticalOverviewFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.STATICSTICAL_OVERVIEW_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_FAILURE
          : ENGLISH_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_FAILURE
    })
  }
}

export const analyticsTotalRequestsController = async (req: Request, res: Response) => {
  const language = serverLanguage

  try {
    const statistical = await statisticalService.totalRequests()

    res.json({
      code: RESPONSE_CODE.ANALYTICS_TOTAL_REQUESTS_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_SUCCESS
          : ENGLISH_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_SUCCESS,
      total: formatNumber(statistical)
    })
  } catch (err) {
    res.json({
      code: RESPONSE_CODE.ANALYTICS_TOTAL_REQUESTS_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_FAILURE
          : ENGLISH_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_FAILURE
    })
  }
}

export const exportStatisticalController = async (
  req: Request<ParamsDictionary, any, StatisticalRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const { buffer, start_date, end_date } = await statisticalService.exportStatistical(req.body.time, language)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ExportStatisticalSuccessful(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.ExportStatisticalSuccessful(user._id.toString(), ip)
    )

    const fileName = `Statistical_Report_${formatDateFull(start_date)}_${formatDateFull(end_date)}.xlsx`
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"`
    )

    res.send(buffer)
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.ExportStatisticalFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.ExportStatisticalFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.EXPORT_STATICSTICAL_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.STATISTICAL_MESSAGE.EXPORT_STATISTICAL_FAILURE
          : ENGLISH_STATIC_MESSAGE.STATISTICAL_MESSAGE.EXPORT_STATISTICAL_FAILURE
    })
  }
}
