// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import express from 'express'
import { contactController, responseContactController } from '~/controllers/contact.controllers'
import { contactValidator, discordApiKeyValidator } from '~/middlewares/contact.middlewares'
import { languageValidator } from '~/middlewares/language.middlewares'
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
router.post(
  '/send',
  languageValidator,
  contactValidator,
  wrapRequestHandler(contactController)
)

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
