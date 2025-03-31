import express from 'express'
import { statisticalOverviewController, analyticsTotalRequestsController } from '~/controllers/statistical.controllers'
import {
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorValidator
} from '~/middlewares/authenticate.middlewares'
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
  authenticateVerifyAccountValidator,
  authenticateAdministratorValidator,
  wrapRequestHandler(statisticalOverviewController)
)

/*
 * Description: Lấy thông tin thống kê số lượt truy cập
 * Path: /api/statistical/analytics-total-requests
 * Method: POST
 */
router.post('/analytics-total-requests', wrapRequestHandler(analyticsTotalRequestsController))

export default router
