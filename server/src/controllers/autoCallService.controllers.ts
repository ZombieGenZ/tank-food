// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { Request, Response } from 'express'
import { GLOBAL_MESSAGE } from '~/constants/message.constants'

export const autoCallServiceHealthController = (req: Request, res: Response) => {
  res.send(GLOBAL_MESSAGE.SERVICE_IS_RUNNING)
}
