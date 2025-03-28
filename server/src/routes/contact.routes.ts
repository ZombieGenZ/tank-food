import express from 'express'
import { contactController, responseContactController } from '~/controllers/contact.controllers'
import { contactValidator, discordApiKeyValidator } from '~/middlewares/contact.middlewares'
import { wrapRequestHandler } from '~/utils/handlers.utils'
const router = express.Router()

/*
 * Description: Gửi yêu cầu liên hệ đến người hổ trợ
 * Path: /api/contact/send
 * Method: POST
 * Body: {
 *    language?: string,
 *    name: string,
 *    email: string,
 *    phone: string,
 *    title: string,
 *    content: string
 * }
 */
router.post('/send', contactValidator, wrapRequestHandler(contactController))

/*
 * Description: Nhận phản hồi từ Bot discord
 * Path: /api/contact/response
 * Method: POST
 * headers: {
 *    Authorization: Apikey <token>
 * },
 * Body: {
 *    contact_id: string,
 *    user_id: string,
 *    reply_content: string,
 *    timestamp: Date
 * }
 */
router.post('/response', discordApiKeyValidator, wrapRequestHandler(responseContactController))

export default router
