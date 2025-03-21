import express from 'express'
import { statisticalOverviewController } from '~/controllers/statistical.controllers'
import { authenticateValidator, authenticateAdministratorValidator } from '~/middlewares/authenticate.middlewares'
import { wrapRequestHandler } from '~/utils/handlers.utils'
const router = express.Router()

/*
 * Description: Lấy thông tin thống kê tổng quan
 * Path: /api/statistical/overview
 * Method: POST
 * headers: {
 *    authorization?: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    time: number
 * }
 */
router.post(
  '/overview',
  authenticateValidator,
  authenticateAdministratorValidator,
  wrapRequestHandler(statisticalOverviewController)
)

export default router
