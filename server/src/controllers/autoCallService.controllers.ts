import { Request, Response } from 'express'
import { GLOBAL_MESSAGE } from '~/constants/message.constants'

export const autoCallServiceHealthController = (req: Request, res: Response) => {
  res.send(GLOBAL_MESSAGE.SERVICE_IS_RUNNING)
}
