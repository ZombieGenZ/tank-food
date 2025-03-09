import { LogTypeEnum } from '~/constants/logs.constants'
import databaseService from './database.services'
import { io, serverRunningTime } from '~/index'
import { db } from './firebase.services'
import Log from '~/models/schemas/logs.schemas'
import { formatDateFull2 } from '~/utils/date.utils'

class LogService {
  async newLog(log_type: LogTypeEnum, log_message: string, created_at?: Date) {
    const logFirebaseRealtime = db.ref(`log/${serverRunningTime}`).push()
    const date = new Date()

    if (log_type == LogTypeEnum.INFO) {
      console.log(`\x1b[37m[${formatDateFull2(created_at || date)} INFO]\x1b[0m ${log_message}\x1b[0m`)
    } else if (log_type == LogTypeEnum.WARN) {
      console.log(`\x1b[33m[${formatDateFull2(created_at || date)} WARN]\x1b[34m ${log_message}\x1b[0m`)
    } else if (log_type == LogTypeEnum.ERROR) {
      console.log(`\x1b[31m[${formatDateFull2(created_at || date)} ERROR]\x1b[33m ${log_message}\x1b[0m`)
    }

    await Promise.all([
      databaseService.logs.insertOne(
        new Log({
          log_type,
          content: log_message,
          time: created_at || date
        })
      ),
      logFirebaseRealtime.set({
        log_type,
        content: log_message,
        time: created_at || date
      }),
      io.to('system-log').emit('new-system-log', {
        log_type,
        content: log_message,
        time: created_at || date
      })
    ])
  }
}

const logService = new LogService()
export default logService
