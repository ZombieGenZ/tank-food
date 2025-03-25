import express from 'express'
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  verifyTokenUserController,
  getUserInfomationController,
  sendEmailVerifyController,
  verifyAccountController,
  sendEmailForgotPasswordController,
  forgotPasswordController
} from '~/controllers/users.controllers'
import { authenticateValidator } from '~/middlewares/authenticate.middlewares'
import {
  registerUserValidator,
  loginUserValidator,
  verifyTokenValidator,
  sendEmailVerifyValidator,
  verifyAccountValidator,
  sendEmailForgotPasswordValidator,
  forgotPasswordValidator
} from '~/middlewares/users.middlewares'
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
router.delete('/logout', authenticateValidator, wrapRequestHandler(logoutUserController))

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

/*
 * Description: Lấy thông tin người dùng
 * Path: /api/users/get-user-infomation
 * Method: POST
 * headers: {
 *    authorization?: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string
 * }
 */
router.post('/get-user-infomation', authenticateValidator, wrapRequestHandler(getUserInfomationController))

/*
 * Description: Gửi lại mã xác thực tài khoản
 * Path: /api/users/send-email-verify
 * Method: PUT
 * headers: {
 *    authorization?: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string
 * }
 */
router.put(
  '/send-email-verify',
  authenticateValidator,
  sendEmailVerifyValidator,
  wrapRequestHandler(sendEmailVerifyController)
)

/*
 * Description: Xác thực tài khoản
 * Path: /api/users/verify-account
 * Method: GET
 * query: {
 *    token: string,
 *    language?: string
 * }
 */
router.get('/verify-account', verifyAccountValidator, wrapRequestHandler(verifyAccountController))

/*
 * Description: Gửi email quên mật khẩu
 * Path: /api/users/send-email-forgot-password
 * Method: PUT
 * body: {
 *    language?: string,
 *    email: string
 * }
 */
router.put(
  '/send-email-forgot-password',
  sendEmailForgotPasswordValidator,
  wrapRequestHandler(sendEmailForgotPasswordController)
)

/*
 * Description: Cập nhật mật khẩu bằng token
 * Path: /api/users/forgot-password
 * Method: PUT
 * body: {
 *    language?: string,
 *    token: string,
 *    new_password: string,
 *    confirm_new_password: string
 * }
 */
router.put('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

export default router
