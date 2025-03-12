import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import HTTPSTATUS from '~/constants/httpStatus.constants'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })

  res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfo: omit(err, ['stack'])
  })

  return
}
