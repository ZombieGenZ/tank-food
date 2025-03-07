import { LogTypeEnum } from '~/constants/logs.constants'
import databaseService from './database.services'
import { io, serverRunningTime } from '~/index'
import { db } from './firebase.services'
import Log from '~/models/schemas/logs.schemas'

class LogService {
  async newLog(log_type: LogTypeEnum, log_message: string, created_at?: Date) {
    const logFirebaseRealtime = db.ref(`log/${serverRunningTime}`).push()
    const date = new Date()

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
