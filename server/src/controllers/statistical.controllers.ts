import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { serverLanguage } from '..'
import { writeErrorLog, writeInfoLog } from '~/utils/log.utils'
import { StatisticalOverviewRequestsBody } from '~/models/requests/statistical.requests'
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

export const statisticalOverviewController = async (
  req: Request<ParamsDictionary, any, StatisticalOverviewRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const statistical = await statisticalService.overview(req.body)

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
