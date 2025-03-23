import express from 'express'
import { getAccountManagementController } from '~/controllers/accountManagement.controllers'
import { authenticateValidator, authenticateAdministratorValidator } from '~/middlewares/authenticate.middlewares'
import { wrapRequestHandler } from '~/utils/handlers.utils'
const router = express.Router()

/*
 * Description: Lấy danh sách tài khoản
 * Path: /api/account-management/get-account
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string
 * }
 */
router.post(
  '/get-account',
  authenticateValidator,
  authenticateAdministratorValidator,
  wrapRequestHandler(getAccountManagementController)
)

export default router
