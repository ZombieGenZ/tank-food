import express from 'express'
import { getVoucherPrivateController } from '~/controllers/voucherPrivate.controllers'
import { authenticateValidator, authenticateVerifyAccountValidator } from '~/middlewares/authenticate.middlewares'
import { wrapRequestHandler } from '~/utils/handlers.utils'
const router = express.Router()

/*
 * Description: Lấy danh sách các voucher (riêng tư)
 * Path: /api/voucher-private/get-voucher
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
  '/get-voucher',
  authenticateValidator,
  authenticateVerifyAccountValidator,
  wrapRequestHandler(getVoucherPrivateController)
)

export default router
