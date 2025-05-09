// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import {
  RegisterUserRequestsBody,
  VerifyEmailVerifyTokenRequestsBody,
  VerifyForgotPasswordTokenRequestsBody,
  ForgotPasswordRequestsBody,
  ChangeInfomationRequestsBody,
  ChangePasswordRequestsBody
} from '~/models/requests/users.requests'
import databaseService from './database.services'
import { signToken, verifyToken } from '~/utils/jwt.utils'
import { TokenType } from '~/constants/jwt.constants'
import RefreshToken from '~/models/schemas/refreshtoken.schemas'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/users.schemas'
import { HashPassword } from '~/utils/encryption.utils'
import { LANGUAGE } from '~/constants/language.constants'
import { ENGLIS_DYNAMIC_MAIL, VIETNAMESE_DYNAMIC_MAIL } from '~/constants/mail.constants'
import { sendMail } from '~/utils/mail.utils'
import { UserTypeEnum } from '~/constants/users.constants'
import { notificationRealtime } from '~/utils/realtime.utils'
import { formatDateFull2 } from '~/utils/date.utils'
import { TokenPayload } from '~/models/requests/authentication.requests'
import notificationService from './notifications.services'

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
    const emailVerifyUrl = `${process.env.APP_URL}/verify-account?token=${emailVerifyToken}&language=${language}`

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

    const data = {
      _id: user_id,
      display_name: payload.display_name,
      email: payload.email,
      password: HashPassword(payload.password),
      phone: payload.phone,
      email_verify_token: emailVerifyToken
    }

    await Promise.all([
      sendMail(payload.email, email_welcome_subject, email_welcome_html),
      sendMail(payload.email, email_verify_subject, email_verify_html),
      notificationService.sendNotification(
        '🎉 Đăng ký tài khoản thành công! Bắt đầu trải nghiệm ngay bằng cách đặt đơn đầu tiên nhé!',
        user_id
      ),
      notificationRealtime('freshSync-admin', 'create-account', 'account/create', data)
    ])

    return authenticate
  }
  signAccessToken(user_id: string) {
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
  signRefreshToken(user_id: string) {
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
  signAccessTokenAndRefreshToken(user_id: string) {
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
  async login(user: User) {
    const authenticate = await this.signAccessTokenAndRefreshToken(user._id.toString())
    await this.insertRefreshToken(user._id.toString(), authenticate[1])

    return authenticate
  }
  async logout(token: string) {
    await databaseService.refreshToken.deleteOne({
      token: token
    })
  }
  async sendEmailVerify(user: User, language: string) {
    const emailVerifyToken = await this.signEmailVerify(user._id.toString())
    const emailVerifyUrl = `${process.env.APP_URL}/verify-account?token=${emailVerifyToken}&language=${language}`

    let email_verify_subject
    let email_verify_html

    if (language == LANGUAGE.VIETNAMESE) {
      email_verify_subject = VIETNAMESE_DYNAMIC_MAIL.emailVerifyMail(emailVerifyUrl).subject
      email_verify_html = VIETNAMESE_DYNAMIC_MAIL.emailVerifyMail(emailVerifyUrl).html
    } else {
      email_verify_subject = ENGLIS_DYNAMIC_MAIL.emailVerifyMail(emailVerifyUrl).subject
      email_verify_html = ENGLIS_DYNAMIC_MAIL.emailVerifyMail(emailVerifyUrl).html
    }

    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: user._id
        },
        {
          $set: {
            email_verify_token: emailVerifyToken
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      sendMail(user.email, email_verify_subject, email_verify_html)
    ])
  }
  async verifyEmailVerifyToken(payload: VerifyEmailVerifyTokenRequestsBody) {
    try {
      const decoded_email_verify_token = (await verifyToken({
        token: payload.token,
        publicKey: process.env.SECURITY_JWT_SECRET_EMAIL_VERIFY_TOKEN as string
      })) as TokenPayload

      if (!decoded_email_verify_token || decoded_email_verify_token.token_type !== TokenType.EmailVerifyToken) {
        return false
      }

      const user = await databaseService.users.findOne({
        _id: new ObjectId(decoded_email_verify_token.user_id),
        email_verify_token: payload.token,
        user_type: UserTypeEnum.UNVERIFIED
      })

      if (!user) {
        return false
      }

      return true
    } catch {
      return false
    }
  }
  async verifyAccount(user: User) {
    const data = {
      user_id: user._id.toString()
    }
    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: user._id
        },
        {
          $set: {
            user_type: UserTypeEnum.VERIFIED,
            email_verify_token: ''
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      notificationRealtime(`freshSync-user-${user._id}`, 'verify-account', `users/${user._id}/verify-account`, data)
    ])
  }
  async sendForgotPassword(user: User, language: string) {
    const forgotPasswordToken = await this.signForgotPassword(user._id.toString())
    const forgotPasswordUrl = `${process.env.APP_URL}/forgot-password?token=${forgotPasswordToken}&language=${language}`

    let forgot_password_subject
    let forgot_password_html

    if (language == LANGUAGE.VIETNAMESE) {
      forgot_password_subject = VIETNAMESE_DYNAMIC_MAIL.forgotPassword(forgotPasswordUrl).subject
      forgot_password_html = VIETNAMESE_DYNAMIC_MAIL.forgotPassword(forgotPasswordUrl).html
    } else {
      forgot_password_subject = ENGLIS_DYNAMIC_MAIL.forgotPassword(forgotPasswordUrl).subject
      forgot_password_html = ENGLIS_DYNAMIC_MAIL.forgotPassword(forgotPasswordUrl).html
    }

    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: user._id
        },
        {
          $set: {
            forgot_password_token: forgotPasswordToken
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      sendMail(user.email, forgot_password_subject, forgot_password_html)
    ])
  }
  async verifyForgotPasswordToken(payload: VerifyForgotPasswordTokenRequestsBody) {
    try {
      const decoded_forgot_password_token = (await verifyToken({
        token: payload.token,
        publicKey: process.env.SECURITY_JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
      })) as TokenPayload

      if (!decoded_forgot_password_token || decoded_forgot_password_token.token_type !== TokenType.ForgotPasswordToken) {
        return false
      }

      const user = await databaseService.users.findOne({
        _id: new ObjectId(decoded_forgot_password_token.user_id),
        forgot_password_token: payload.token
      })

      if (!user) {
        return false
      }

      return true
    } catch {
      return false
    }
  }
  async forgotPassword(
    user: User,
    payload: ForgotPasswordRequestsBody,
    location: string,
    ip: string,
    browser: string,
    os: string,
    language: string
  ) {
    const date = formatDateFull2(new Date())
    let change_password_subject
    let change_password_html

    if (language == LANGUAGE.VIETNAMESE) {
      change_password_subject = VIETNAMESE_DYNAMIC_MAIL.changePassword(date, location, ip, browser, os).subject
      change_password_html = VIETNAMESE_DYNAMIC_MAIL.changePassword(date, location, ip, browser, os).html
    } else {
      change_password_subject = ENGLIS_DYNAMIC_MAIL.changePassword(date, location, ip, browser, os).subject
      change_password_html = ENGLIS_DYNAMIC_MAIL.changePassword(date, location, ip, browser, os).html
    }

    const data = {
      date
    }

    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: user._id
        },
        {
          $set: {
            password: HashPassword(payload.new_password),
            forgot_password_token: ''
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      databaseService.refreshToken.deleteMany({
        user_id: user._id
      }),
      notificationRealtime(`freshSync-user-${user._id}`, 'logout', `user/${user._id}/logout`, data),
      sendMail(user.email, change_password_subject, change_password_html)
    ])
  }
  async changeInfomation(payload: ChangeInfomationRequestsBody, user: User) {
    const data = {
      display_name: payload.display_name,
      phone: payload.phone
    }

    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: user._id
        },
        {
          $set: {
            display_name: payload.display_name,
            phone: payload.phone
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      notificationRealtime(`freshSync-admin`, 'change-infomation', `account-management/change-infomation`, data)
    ])
  }
  async changePassword(
    payload: ChangePasswordRequestsBody,
    user: User,
    location: string,
    ip: string,
    browser: string,
    os: string,
    language: string
  ) {
    const date = formatDateFull2(new Date())
    let change_password_subject
    let change_password_html

    if (language == LANGUAGE.VIETNAMESE) {
      change_password_subject = VIETNAMESE_DYNAMIC_MAIL.changePassword(date, location, ip, browser, os).subject
      change_password_html = VIETNAMESE_DYNAMIC_MAIL.changePassword(date, location, ip, browser, os).html
    } else {
      change_password_subject = ENGLIS_DYNAMIC_MAIL.changePassword(date, location, ip, browser, os).subject
      change_password_html = ENGLIS_DYNAMIC_MAIL.changePassword(date, location, ip, browser, os).html
    }

    const data = {
      date
    }

    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: user._id
        },
        {
          $set: {
            password: HashPassword(payload.new_password)
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      databaseService.refreshToken.deleteMany({
        user_id: user._id
      }),
      notificationRealtime(`freshSync-user-${user._id}`, 'logout', `user/${user._id}/logout`, data),
      sendMail(user.email, change_password_subject, change_password_html)
    ])
  }
}

const userService = new UserService()
export default userService
