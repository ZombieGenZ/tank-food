// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { LANGUAGE } from '~/constants/language.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import { serverLanguage } from '~/index'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })

  res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    code: RESPONSE_CODE.SERVER_SIDE_ERROR,
    message: err.message,
    errorInfo: omit(err, ['stack'])
  })

  return
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(HTTPSTATUS.NOT_FOUND).render('NotFound', {
    title:
      serverLanguage == LANGUAGE.VIETNAMESE
        ? 'Có vẻ như bạn đã bị mất kết nối'
        : 'Seem like you\'re lost',
    subtitle:
      serverLanguage == LANGUAGE.VIETNAMESE
        ? 'Trang bạn tìm kiếm không tồn tại!'
        : 'A page you\'re looking for is not available',
    url: process.env.APP_URL,
    back_title:
      serverLanguage == LANGUAGE.VIETNAMESE
        ? 'Về trang chủ'
        : 'Back to home page',
    trademark_name: process.env.TRADEMARK_NAME
  });
}
