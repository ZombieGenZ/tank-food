// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import express from 'express'
import { statisticalOverviewController, analyticsTotalRequestsController, exportStatisticalController } from '~/controllers/statistical.controllers'
import {
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorValidator
} from '~/middlewares/authenticate.middlewares'
import { languageValidator } from '~/middlewares/language.middlewares'
import { statisticalTimeValidator } from '~/middlewares/statistical.middlewares'
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorValidator,
  statisticalTimeValidator,
  wrapRequestHandler(statisticalOverviewController)
)

/*
 * Description: Lấy thông tin thống kê số lượt truy cập
 * Path: /api/statistical/analytics-total-requests
 * Method: GET
 */
router.get(
  '/analytics-total-requests',
  languageValidator,
  wrapRequestHandler(analyticsTotalRequestsController)
)

/*
 * Description: Lấy thông tin thống kê tổng quan
 * Path: /api/statistical/export
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
  '/export',
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorValidator,
  statisticalTimeValidator,
  wrapRequestHandler(exportStatisticalController)
)

export default router
