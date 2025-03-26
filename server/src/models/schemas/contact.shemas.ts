import { ObjectId } from 'mongodb'

interface ContactType {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  title: string
  content: string
  created_at?: Date
}

export default class Contact {
  _id: ObjectId
  name: string
  email: string
  phone: string
  title: string
  content: string
  created_at: Date

  constructor(contact: ContactType) {
    this._id = contact._id || new ObjectId()
    this.name = contact.name
    this.email = contact.email
    this.phone = contact.phone
    this.title = contact.title
    this.content = contact.content
    this.created_at = contact.created_at || new Date()
  }
}
