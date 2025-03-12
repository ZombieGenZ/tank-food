import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'

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
