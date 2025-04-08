import { ObjectId } from 'mongodb';
import { LANGUAGE } from '~/constants/language.constants';
import { serverLanguage } from '~/index';

interface NotificationType {
  _id?: ObjectId
  message: string
  sender?: string
  receiver: ObjectId
  is_read?: boolean
  created_at?: Date
}

export default class Notification {
  _id: ObjectId
  message: string
  sender: string
  receiver: ObjectId
  is_read: boolean
  created_at: Date

  constructor(notification: NotificationType) {
    this._id = notification._id || new ObjectId()
    this.message = notification.message
    this.sender = notification.sender || serverLanguage == LANGUAGE.VIETNAMESE ? 'Hệ thống' : 'System'
    this.receiver = notification.receiver
    this.is_read = notification.is_read || false
    this.created_at = notification.created_at || new Date()
    
  }
}
