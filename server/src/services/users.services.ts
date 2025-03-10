import { RegisterUserRequestsBody, LoginUserRequestsBody } from '~/models/requests/users.requests'
import databaseService from './database.services'
import { signToken } from '~/utils/jwt.utils'
import { TokenType } from '~/constants/jwt.constants'
import RefreshToken from '~/models/schemas/refreshtoken.schemas'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/users.schemas'
import { HashPassword } from '~/utils/encryption.utils'
import { LANGUAGE } from '~/constants/language.constants'
import { ENGLIS_DYNAMIC_MAIL, VIETNAMESE_DYNAMIC_MAIL } from '~/constants/mail.constants'
import { sendMail } from '~/utils/mail.utils'

class UserService {
  async checkEmailExits(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
  async checkPhoneExits(phone: string) {
    const user = await databaseService.users.findOne({ phone })
    return Boolean(user)
  }
  async register(payload: RegisterUserRequestsBody, language: string) {
    const user_id = new ObjectId()

    const emailVerifyToken = await this.signEmailVerify(user_id.toString())
    const emailVerifyUrl = `${process.env.APP_URL}/email-verify?token=${emailVerifyToken}`

    await databaseService.users.insertOne(
      new User({
        _id: user_id,
        display_name: payload.display_name,
        email: payload.email,
        password: HashPassword(payload.password),
        phone: payload.phone,
        email_verify_token: emailVerifyToken
      })
    )

    const authenticate = await this.signAccessTokenAndRefreshToken(user_id.toString())
    await this.insertRefreshToken(user_id.toString(), authenticate[1])

    let email_welcome_subject
    let email_welcome_html

    let email_verify_subject
    let email_verify_html

    if (language == LANGUAGE.VIETNAMESE) {
      email_welcome_subject = VIETNAMESE_DYNAMIC_MAIL.welcomeMail(payload.display_name).subject
      email_welcome_html = VIETNAMESE_DYNAMIC_MAIL.welcomeMail(payload.display_name).html
      email_verify_subject = VIETNAMESE_DYNAMIC_MAIL.emailVerifyMail(emailVerifyUrl).subject
      email_verify_html = VIETNAMESE_DYNAMIC_MAIL.emailVerifyMail(emailVerifyUrl).html
    } else {
      email_welcome_subject = ENGLIS_DYNAMIC_MAIL.welcomeMail(payload.display_name).subject
      email_welcome_html = ENGLIS_DYNAMIC_MAIL.welcomeMail(payload.display_name).html
      email_verify_subject = ENGLIS_DYNAMIC_MAIL.emailVerifyMail(emailVerifyUrl).subject
      email_verify_html = ENGLIS_DYNAMIC_MAIL.emailVerifyMail(emailVerifyUrl).html
    }

    await Promise.all([
      sendMail(payload.email, email_welcome_subject, email_welcome_html),
      sendMail(payload.email, email_verify_subject, email_verify_html)
    ])

    return authenticate
  }
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.AccessToken
      },
      privateKey: process.env.SECURITY_JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.SECURITY_ACCESS_TOKEN_EXPIRES_IN as any
      }
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.SECURITY_REFRESH_TOKEN_EXPIRES_IN as any
      }
    })
  }
  private signEmailVerify(user_id: string) {
    return signToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.EmailVerifyToken
      },
      privateKey: process.env.SECURITY_JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.SECURITY_EMAIL_VERIFY_EXPIRES_IN as any
      }
    })
  }
  private signForgotPassword(user_id: string) {
    return signToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: process.env.SECURITY_JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.SECURITY_FORGOT_PASSWORD_EXPIRES_IN as any
      }
    })
  }
  private signAccessTokenAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  async insertRefreshToken(user_id: string, token: string) {
    await databaseService.refreshToken.insertOne(
      new RefreshToken({
        token,
        user_id: new ObjectId(user_id)
      })
    )
  }
  async updateRefreshToken(old_token: string, new_token: string) {
    await databaseService.refreshToken.updateOne(
      {
        token: old_token
      },
      {
        $set: {
          token: new_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }
  async login(user: User, payload: LoginUserRequestsBody, language: string) {
    const authenticate = await this.signAccessTokenAndRefreshToken(user._id.toString())
    await this.insertRefreshToken(user._id.toString(), authenticate[1])

    return authenticate
  }
  async logout(token: string) {
    await databaseService.refreshToken.deleteOne({
      token: token
    })
  }
}

const userService = new UserService()
export default userService
