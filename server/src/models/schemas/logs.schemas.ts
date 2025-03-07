import { ObjectId } from 'mongodb'
import { LogTypeEnum } from '~/constants/logs.constants'

export interface LogType {
  _id?: ObjectId
  log_type?: LogTypeEnum
  content: string
  time?: Date
}

export default class Log {
  _id: ObjectId
  log_type: LogTypeEnum
  content: string
  time: Date
  constructor(log: LogType) {
    this._id = log._id || new ObjectId()
    this.log_type = log.log_type || LogTypeEnum.INFO
    this.content = log.content
    this.time = log.time || new Date()
  }
}
