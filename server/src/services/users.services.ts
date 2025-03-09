import { RegisterUser } from '~/models/requests/users.requests'
import databaseService from './database.services'
import { signToken } from '~/utils/jwt.utils'
import { TokenType } from '~/constants/jwt.constants'
import RefreshToken from '~/models/schemas/refreshtoken.schemas'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/users.schemas'
import { HashPassword } from '~/utils/encryption.utils'

class UserService {
  async checkEmailExits(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
  async checkPhoneExits(phone: string) {
    const user = await databaseService.users.findOne({ phone })
    return Boolean(user)
  }
  async register(payload: RegisterUser) {
    const user_id = new ObjectId()

    const email_verify = await this.signEmailVerify(user_id.toString())

    await databaseService.users.insertOne(
      new User({
        _id: user_id,
        display_name: payload.display_name,
        email: payload.email,
        password: HashPassword(payload.password),
        phone: payload.phone,
        email_verify_token: email_verify
      })
    )

    const authenticate = await this.signAccessTokenAndRefreshToken(user_id.toString())
    await this.insertRefreshToken(user_id.toString(), authenticate[1])

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
}

const userService = new UserService()
export default userService
