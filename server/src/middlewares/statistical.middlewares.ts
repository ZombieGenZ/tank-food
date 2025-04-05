import { Request, Response, NextFunction } from 'express'
import { serverLanguage } from '~/index'
import { checkSchema } from 'express-validator'
import { LANGUAGE } from '~/constants/language.constants'
import { ENGLISH_STATIC_MESSAGE, VIETNAMESE_STATIC_MESSAGE } from '~/constants/message.constants'

export const statisticalOverviewValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage
  checkSchema(
    {
      time: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_TIME_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_TIME_IS_REQUIRED
        },
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_TIME_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_TIME_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_TIME_IS_NOT_VALID
                  : ENGLISH_STATIC_MESSAGE.STATISTICAL_MESSAGE.STATISTICAL_TIME_IS_NOT_VALID
              )
            }

            return true
          }
        }
      }
    },
    ['body']
  )
}
