import { ObjectId } from 'mongodb'
import { ResponseTypeEnum } from '~/constants/contact.constants'

interface ContactType {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  title: string
  content: string
  discord_message_data?: { user_id: string; message_id: string }[]
  response_type?: ResponseTypeEnum
  response?: string
  discord_user_id_response?: string
  created_at?: Date
  updated_at?: Date
}

export default class Contact {
  _id: ObjectId
  name: string
  email: string
  phone: string
  title: string
  content: string
  discord_message_data: { user_id: string; message_id: string }[]
  response_type: ResponseTypeEnum
  response: string
  discord_user_id_response: string
  created_at: Date
  updated_at: Date

  constructor(contact: ContactType) {
    this._id = contact._id || new ObjectId()
    this.name = contact.name
    this.email = contact.email
    this.phone = contact.phone
    this.title = contact.title
    this.content = contact.content
    this.discord_message_data = contact.discord_message_data || []
    this.response_type = contact.response_type || ResponseTypeEnum.PENDING
    this.response = contact.response || ''
    this.discord_user_id_response = contact.discord_user_id_response || ''
    this.created_at = contact.created_at || new Date()
    this.updated_at = contact.updated_at || new Date()
  }
}
