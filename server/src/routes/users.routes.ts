import express from 'express'
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  verifyTokenUserController,
  getUserInfomationController,
  sendEmailVerifyController,
  verifyEmailVerifyTokenController,
  verifyAccountController,
  sendEmailForgotPasswordController,
  verifyForgotPasswordTokenController,
  forgotPasswordController,
  changeInformationController,
  changePasswordController
} from '~/controllers/users.controllers'
import { authenticateValidator } from '~/middlewares/authenticate.middlewares'
import { languageValidator } from '~/middlewares/language.middlewares'
import {
  registerUserValidator,
  loginUserValidator,
  verifyTokenValidator,
  sendEmailVerifyValidator,
  verifyEmailVerifyTokenValidator,
  verifyAccountValidator,
  sendEmailForgotPasswordValidator,
  verifyForgotPasswordTokenValidator,
  forgotPasswordValidator,
  changeInformationValidator,
  changePasswordValidator
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
 *    confirm_password: string,
 *    'cf-turnstile-response': string
 * }
 */
router.post(
  '/register',
  languageValidator,
  registerUserValidator,
  wrapRequestHandler(registerUserController)
)

/*
 * Description: Đăng nhập vào một tài khoản có trong CSDL
 * Path: /api/users/login
 * Method: POST
 * Body: {
 *    language?: string,
 *    email: string,
 *    password: string,
 *    'cf-turnstile-response': string
 * }
 */
router.post(
  '/login',
  languageValidator,
  loginUserValidator,
  wrapRequestHandler(loginUserController)
)

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
router.delete(
  '/logout',
  languageValidator,
  authenticateValidator,
  wrapRequestHandler(logoutUserController)
)

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
router.post(
  '/verify-token',
  languageValidator,
  verifyTokenValidator,
  wrapRequestHandler(verifyTokenUserController)
)

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
router.post(
  '/get-user-infomation',
  languageValidator,
  authenticateValidator,
  wrapRequestHandler(getUserInfomationController)
)

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
  languageValidator,
  authenticateValidator,
  sendEmailVerifyValidator,
  wrapRequestHandler(sendEmailVerifyController)
)

/*
 * Description: Xác minh token xác minh tài khoản
 * Path: /api/users/verify-email-verify-token
 * Method: POST
 * body: {
 *    language?: string,
 *    token: string
 * }
 */
router.post(
  '/verify-email-verify-token',
  languageValidator,
  verifyEmailVerifyTokenValidator,
  wrapRequestHandler(verifyEmailVerifyTokenController)
)

/*
 * Description: Xác thực tài khoản
 * Path: /api/users/verify-account
 * Method: POST
 * body: {
 *    language?: string,
 *    token: string
 * }
 */
router.post(
  '/verify-account',
  languageValidator,
  verifyAccountValidator,
  wrapRequestHandler(verifyAccountController)
)

/*
 * Description: Gửi email quên mật khẩu
 * Path: /api/users/send-email-forgot-password
 * Method: PUT
 * body: {
 *    language?: string,
 *    email: string,
 *    'cf-turnstile-response': string
 * }
 */
router.put(
  '/send-email-forgot-password',
  languageValidator,
  sendEmailForgotPasswordValidator,
  wrapRequestHandler(sendEmailForgotPasswordController)
)

/*
 * Description: Xác minh token quên mật khẩu
 * Path: /api/users/verify-forgot-password-token
 * Method: POST
 * body: {
 *    language?: string,
 *    token: string
 * }
 */
router.post(
  '/verify-forgot-password-token',
  languageValidator,
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordTokenController)
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
router.put(
  '/forgot-password',
  languageValidator,
  forgotPasswordValidator,
  wrapRequestHandler(forgotPasswordController)
)

/*
 * Description: Thay đổi thông tin tài khoản
 * Path: /api/users/change-infomation
 * Method: PUT
 * headers: {
 *    authorization?: Bearer <token>
 * },
 * body: {
 *    language?: string,
 *    refresh_token: string,
 *    display_name: string,
 *    phone: string
 * }
 */
router.put(
  '/change-infomation',
  languageValidator,
  authenticateValidator,
  changeInformationValidator,
  wrapRequestHandler(changeInformationController)
)

/*
 * Description: Thay đổi mật khẩu
 * Path: /api/users/change-password
 * Method: PUT
 * headers: {
 *    authorization?: Bearer <token>
 * },
 * body: {
 *    language?: string,
 *    refresh_token: string,
 *    password: string,
 *    new_password: string,
 *    confirm_new_password: string
 * }
 */
router.put(
  '/change-password',
  languageValidator,
  authenticateValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default router
