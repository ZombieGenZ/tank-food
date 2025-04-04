import express from 'express'
import {
  getAccountManagementController,
  banAccountManagementController,
  unBanAccountManagementController
} from '~/controllers/accountManagement.controllers'
import { banAccountValidator, unBanAccountValidator } from '~/middlewares/accountManagement.middlewares'
import {
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorValidator
} from '~/middlewares/authenticate.middlewares'
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
  authenticateVerifyAccountValidator,
  authenticateAdministratorValidator,
  wrapRequestHandler(getAccountManagementController)
)

/*
 * Description: Khóa tài khoản
 * Path: /api/account-management/ban-account
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    user_id: string,
 *    reason: string,
 *    time: string
 * }
 */
router.put(
  '/ban-account',
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorValidator,
  banAccountValidator,
  wrapRequestHandler(banAccountManagementController)
)

/*
 * Description: Mở khóa tài khoản
 * Path: /api/account-management/unban-account
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    user_id: string
 * }
 */
router.put(
  '/unban-account',
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorValidator,
  unBanAccountValidator,
  wrapRequestHandler(unBanAccountManagementController)
)

export default router
