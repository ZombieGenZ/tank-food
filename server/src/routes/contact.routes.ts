import express from 'express'
import { contactController } from '~/controllers/contact.controllers'
import { contactValidator } from '~/middlewares/contact.middlewares'
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

export default router
