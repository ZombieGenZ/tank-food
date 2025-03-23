import { ObjectId } from 'mongodb'
import { UserRoleEnum, UserTypeEnum } from '~/constants/users.constants'

export interface UserType {
  _id?: ObjectId
  display_name: string
  email: string
  phone: string
  password: string
  user_type?: UserTypeEnum
  role?: UserRoleEnum
  email_verify_token?: string
  forgot_password_token?: string
  salary?: number
  penalty?: {
    created_by: ObjectId
    reason: string
    expired_at: Date
  } | null
  created_at?: Date
  updated_at?: Date
}

export default class User {
  _id: ObjectId
  display_name: string
  email: string
  phone: string
  password: string
  user_type: UserTypeEnum
  role: UserRoleEnum
  email_verify_token: string
  forgot_password_token: string
  salary: number
  penalty: {
    created_by: ObjectId
    reason: string
    expired_at: Date
  } | null
  created_at: Date
  updated_at: Date

  constructor(user: UserType) {
    const date = new Date()

    this._id = user._id || new ObjectId()
    this.display_name = user.display_name
    this.email = user.email
    this.phone = user.phone
    this.password = user.password
    this.user_type = user.user_type || UserTypeEnum.UNVERIFIED
    this.role = user.role || UserRoleEnum.CUSTOMER
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.salary = user.salary || 0
    this.penalty = user.penalty || null
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }
}
