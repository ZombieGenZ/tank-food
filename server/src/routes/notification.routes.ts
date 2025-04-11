import express from 'express'
import { getNotificationValidator } from '~/middlewares/notification.middlewares'
import {
  authenticateValidator
} from '~/middlewares/authenticate.middlewares'
import { wrapRequestHandler } from '~/utils/handlers.utils'
import { getNotificationController } from '~/controllers/notification.controllers'
import { languageValidator } from '~/middlewares/language.middlewares'
const router = express.Router()

/*
 * Description: Lấy thông tin các thông báo
 * Path: /api/notification/get-notification
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    quantity: number
 */
router.post(
  '/get-notification',
  languageValidator,
  authenticateValidator,
  getNotificationValidator,
  wrapRequestHandler(getNotificationController)
)

export default router
