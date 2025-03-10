import express from 'express'
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  verifyTokenUserController
} from '~/controllers/users.controllers'
import { authenticateValidator } from '~/middlewares/authenticate.middlewares'
import { registerUserValidator, loginUserValidator, verifyTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers.utils'
const router = express.Router()

/*
 * Description: Tạo một tài khoản mới
 * Path: /api/users/register
 * Method: POST
 * Body: {
 *    language?: string,
 *    display_name: string,
 *    email: string,
 *    phone: string,
 *    password: string,
 *    confirm_password: string
 * }
 */
router.post('/register', registerUserValidator, wrapRequestHandler(registerUserController))

/*
 * Description: Đăng nhập vào một tài khoản có trong CSDL
 * Path: /api/users/login
 * Method: POST
 * Body: {
 *    language?: string,
 *    email: string,
 *    password: string
 * }
 */
router.post('/login', loginUserValidator, wrapRequestHandler(loginUserController))

/*
 * Description: Đăng xuất khỏi một tài khoản có trong CSDL
 * Path: /api/users/logout
 * Method: DELETE
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string
 * }
 */
router.post('/logout', authenticateValidator, wrapRequestHandler(logoutUserController))

/*
 * Description: Xác thực token và cấp token mới cho người dùng
 * Path: /api/users/verify-token
 * Method: POST
 * headers: {
 *    authorization?: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string
 * }
 */
router.post('/verify-token', verifyTokenValidator, wrapRequestHandler(verifyTokenUserController))

export default router
