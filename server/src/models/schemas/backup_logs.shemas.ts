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
    this.file_id = log.drive_url
    this.created_at = log.created_at || new Date()
  }
}
