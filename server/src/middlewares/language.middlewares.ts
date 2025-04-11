import { Request, Response, NextFunction } from 'express'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { LANGUAGE } from '~/constants/language.constants'
import { ENGLISH_STATIC_MESSAGE, VIETNAMESE_STATIC_MESSAGE } from '~/constants/message.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import { deleteTemporaryFile } from '~/utils/image.utils'

export const languageValidator = (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language

  if (!language) {
    next()
    return
  }

  if (typeof language !== 'string' || !(language in LANGUAGE)) {
    res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json(
      {
        code: RESPONSE_CODE.INVALID_LANGUAGE,
        message:
          language == LANGUAGE.VIETNAMESE
            ? VIETNAMESE_STATIC_MESSAGE.LANGUAGE_MESSAGE.LANGUAGE_INVALID
            : ENGLISH_STATIC_MESSAGE.LANGUAGE_MESSAGE.LANGUAGE_INVALID
      }
    )
    return
  }
}

export const languageUploadImageValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language

  if (!language) {
    next()
    return
  }

  if (typeof language !== 'string' || !(language in LANGUAGE)) {
    await deleteTemporaryFile(req.file)
    res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json(
      {
        code: RESPONSE_CODE.INVALID_LANGUAGE,
        message:
          language == LANGUAGE.VIETNAMESE
            ? VIETNAMESE_STATIC_MESSAGE.LANGUAGE_MESSAGE.LANGUAGE_INVALID
            : ENGLISH_STATIC_MESSAGE.LANGUAGE_MESSAGE.LANGUAGE_INVALID
      }
    )
    return
  }
}
