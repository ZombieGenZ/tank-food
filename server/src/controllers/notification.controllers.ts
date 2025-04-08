import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { GetNotificationRequestsBody } from '~/models/requests/notifications.requests'
import { serverLanguage } from '~/index'
import { LANGUAGE } from '~/constants/language.constants'
import { writeInfoLog, writeErrorLog } from '~/utils/log.utils'
import { ENGLIS_DYNAMIC_MESSAGE, ENGLISH_STATIC_MESSAGE, VIETNAMESE_DYNAMIC_MESSAGE, VIETNAMESE_STATIC_MESSAGE } from '~/constants/message.constants'
import User from '~/models/schemas/users.schemas'
import notificationService from '~/services/notifications.services'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'

export const getNotificationController = async (
  req: Request<ParamsDictionary, any, GetNotificationRequestsBody>,
  res: Response
) => {
  const ip = (req.headers['cf-connecting-ip'] || req.ip) as string
  const user = req.user as User
  const language = req.body.language || serverLanguage

  try {
    const notification = await notificationService.getNotification(req.body, user)

    await writeInfoLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.getNotificationSuccessful(user._id.toString(), ip)
        : ENGLIS_DYNAMIC_MESSAGE.getNotificationSuccessful(user._id.toString(), ip)
    )

    res.json({
      code: RESPONSE_CODE.GET_USER_NOTIFICATION_SUCCESSFUL,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.NOTIFICATION_MESSAGE.GET_NOTIFICATION_SUCCESS
          : ENGLISH_STATIC_MESSAGE.NOTIFICATION_MESSAGE.GET_NOTIFICATION_SUCCESS,
      notification
    })
  } catch (err) {
    await writeErrorLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.getNotificationFailed(user._id.toString(), ip, err)
        : ENGLIS_DYNAMIC_MESSAGE.getNotificationFailed(user._id.toString(), ip, err)
    )

    res.json({
      code: RESPONSE_CODE.GET_USER_NOTIFICATION_FAILED,
      message:
        language == LANGUAGE.VIETNAMESE
          ? VIETNAMESE_STATIC_MESSAGE.NOTIFICATION_MESSAGE.GET_NOTIFICATION_FAILURE
          : ENGLISH_STATIC_MESSAGE.NOTIFICATION_MESSAGE.GET_NOTIFICATION_FAILURE
    })
  }
}