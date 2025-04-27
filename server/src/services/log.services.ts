// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { LogTypeEnum } from '~/constants/logs.constants'
import databaseService from './database.services'
import { serverRunningTime } from '~/index'
import Log from '~/models/schemas/logs.schemas'
import { formatDateFull2 } from '~/utils/date.utils'
import { notificationRealtime } from '~/utils/realtime.utils'

class LogService {
  async newLog(log_type: LogTypeEnum, log_message: string, created_at?: Date) {
    const date = new Date()

    if (log_type == LogTypeEnum.INFO) {
      console.log(`\x1b[37m[${formatDateFull2(created_at || date)} INFO]\x1b[0m ${log_message}\x1b[0m`)
    } else if (log_type == LogTypeEnum.WARN) {
      console.log(`\x1b[33m[${formatDateFull2(created_at || date)} WARN]\x1b[34m ${log_message}\x1b[0m`)
    } else if (log_type == LogTypeEnum.ERROR) {
      console.log(`\x1b[31m[${formatDateFull2(created_at || date)} ERROR]\x1b[33m ${log_message}\x1b[0m`)
    }

    const data = {
      log_type,
      content: log_message,
      time: created_at || date
    }

    await Promise.all([
      databaseService.logs.insertOne(
        new Log({
          log_type,
          content: log_message,
          time: created_at || date
        })
      ),
      notificationRealtime('system-log', 'new-system-log', `log/${serverRunningTime}`, data)
    ])
  }
}

const logService = new LogService()
export default logService
