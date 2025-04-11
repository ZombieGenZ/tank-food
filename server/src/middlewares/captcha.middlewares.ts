import axios from 'axios'
import { Request, Response, NextFunction } from 'express'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { LANGUAGE } from '~/constants/language.constants'
import { VIETNAMESE_STATIC_MESSAGE, ENGLISH_STATIC_MESSAGE, VIETNAMESE_DYNAMIC_MESSAGE, ENGLIS_DYNAMIC_MESSAGE } from '~/constants/message.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import { serverLanguage } from '~/index'
import { writeWarnLog } from '~/utils/log.utils'

export const verifyRequestValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  const turnstile_secret_key = process.env.CLOUDFLARE_TURNSTILE_SECRETKEY as string
  const turnstile_response = req.body['cf-turnstile-response']

  if (!turnstile_response || typeof turnstile_response !== 'string') {
    res.status(HTTPSTATUS.BAD_REQUEST).json(
      {
        code: RESPONSE_CODE.INVALID_CAPTCHA,
        message:
          language == LANGUAGE.VIETNAMESE
            ? VIETNAMESE_STATIC_MESSAGE.CAPTCHA_MESSAGE.CAPTCHA_INVALID
            : ENGLISH_STATIC_MESSAGE.CAPTCHA_MESSAGE.CAPTCHA_INVALID
      }
    )
    return
  }

  try {
    const verificationResponse = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        secret: turnstile_secret_key,
        response: turnstile_response
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const { success } = verificationResponse.data;

    if (!success) {
      res.status(HTTPSTATUS.BAD_REQUEST).json(
        {
          code: RESPONSE_CODE.INVALID_CAPTCHA,
          message:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.CAPTCHA_MESSAGE.CAPTCHA_INVALID
              : ENGLISH_STATIC_MESSAGE.CAPTCHA_MESSAGE.CAPTCHA_INVALID
        }
      )
      return
    }

    next()
  } catch (error) {
    await writeWarnLog(
      serverLanguage == LANGUAGE.VIETNAMESE
        ? VIETNAMESE_DYNAMIC_MESSAGE.CaptchaVerificationFailed(error)
        : ENGLIS_DYNAMIC_MESSAGE.CaptchaVerificationFailed(error)
    )
    res.status(HTTPSTATUS.BAD_REQUEST).json(
      {
        code: RESPONSE_CODE.INVALID_CAPTCHA,
        message:
          language == LANGUAGE.VIETNAMESE
            ? VIETNAMESE_STATIC_MESSAGE.CAPTCHA_MESSAGE.CAPTCHA_INVALID
            : ENGLISH_STATIC_MESSAGE.CAPTCHA_MESSAGE.CAPTCHA_INVALID
      }
    )
    return
  }

}
