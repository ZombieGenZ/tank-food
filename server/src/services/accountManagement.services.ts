import databaseService from './database.services'

class AccountManagementService {
  async getAccount() {
    return await databaseService.users
      .find()
      .project({ password: 0, email_verify_token: 0, forgot_password_token: 0 })
      .sort({ created_at: 1 })
      .toArray()
  }
}

const accountManagementService = new AccountManagementService()
export default accountManagementService
