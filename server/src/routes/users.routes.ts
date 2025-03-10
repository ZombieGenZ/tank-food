import express from 'express'
import { registerUserController, loginUserController } from '~/controllers/users.controllers'
import { registerUserValidator, loginUserValidator } from '~/middlewares/users.middlewares'
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

export default router
