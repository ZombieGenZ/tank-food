import { BanAccountRequestsBody } from '~/models/requests/accountManagement.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/users.schemas'
import { notificationRealtime } from '~/utils/realtime.utils'

class AccountManagementService {
  async getAccount() {
    return await databaseService.users
      .find()
      .project({ password: 0, email_verify_token: 0, forgot_password_token: 0 })
      .sort({ created_at: 1 })
      .toArray()
  }
  async ban(payload: BanAccountRequestsBody, banned_time: Date, user: User) {
    const penalty = {
      created_by: user._id,
      reason: payload.reason,
      expired_at: banned_time
    }
    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: new ObjectId(payload.user_id)
        },
        {
          $set: {
            penalty: penalty
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      notificationRealtime(`freshSync-user-${payload.user_id}`, 'ban', `user/${payload.user_id}/ban`, penalty),
      notificationRealtime(`freshSync-admin`, 'ban-account', `account-management/ban`, penalty)
    ])
  }
  async unBan(user_id: string) {
    const data = {
      user_id
    }

    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            penalty: null
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      notificationRealtime(`freshSync-user-${user_id}`, 'unBan', `user/${user_id}/unBan`, data),
      notificationRealtime(`freshSync-admin`, 'unban-account', `account-management/unBan`, data)
    ])
  }
}

const accountManagementService = new AccountManagementService()
export default accountManagementService
