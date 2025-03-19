import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class RefreshToken {
  _id: ObjectId
  token: string
  user_id: ObjectId
  created_at: Date
  updated_at: Date
  
  constructor(token: RefreshTokenType) {
    const date = new Date()

    this._id = token._id || new ObjectId()
    this.token = token.token
    this.user_id = token.user_id
    this.created_at = token.created_at || date
    this.updated_at = token.updated_at || date
  }
}
