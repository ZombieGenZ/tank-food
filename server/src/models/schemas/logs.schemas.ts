// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

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
