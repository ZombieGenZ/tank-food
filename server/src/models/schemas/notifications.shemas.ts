// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

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
