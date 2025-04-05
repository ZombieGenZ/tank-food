import express from 'express'
import { getVoucherPrivateUnUsedController, getVoucherPrivateUsedController } from '~/controllers/voucherPrivate.controllers'
import { authenticateValidator, authenticateVerifyAccountValidator } from '~/middlewares/authenticate.middlewares'
import { wrapRequestHandler } from '~/utils/handlers.utils'
const router = express.Router()

/*
 * Description: Lấy danh sách các voucher (riêng tư) chưa sử dụng
 * Path: /api/voucher-private/get-voucher-unused
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string
 * }
 */
router.post(
  '/get-voucher-unused',
  authenticateValidator,
  authenticateVerifyAccountValidator,
  wrapRequestHandler(getVoucherPrivateUnUsedController)
)

/*
 * Description: Lấy danh sách các voucher (riêng tư) đã sử dụng
 * Path: /api/voucher-private/get-voucher-used
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string
 * }
 */
router.post(
  '/get-voucher-used',
  authenticateValidator,
  authenticateVerifyAccountValidator,
  wrapRequestHandler(getVoucherPrivateUsedController)
)

export default router
