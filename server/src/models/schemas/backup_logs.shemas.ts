// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { ObjectId } from 'mongodb'

interface BackupLogType {
  _id?: ObjectId
  drive_url: string
  file_id: string
  created_at?: Date
}

export default class BackupLog {
  _id: ObjectId
  drive_url: string
  file_id: string
  created_at: Date

  constructor(log: BackupLogType) {
    this._id = log._id || new ObjectId()
    this.drive_url = log.drive_url
    this.file_id = log.file_id
    this.created_at = log.created_at || new Date()
  }
}
