import express from 'express'
import { createVoucherController } from '~/controllers/voucherPublic.controllers'
import { authenticateAdministratorValidator, authenticateValidator } from '~/middlewares/authenticate.middlewares'
import { createVoucherValidator } from '~/middlewares/voucherPublic.middlewares'
import { wrapRequestHandler } from '~/utils/handlers.utils'
const router = express.Router()

/*
 * Description: Tạo một mã giảm giá (Công khai) mới
 * Path: /api/voucher-public/create
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    code: string,
 *    quantity: number,
 *    discount: number,
 *    requirement: number.
 *    expiration_date: Date
 * }
 */
router.post(
  '/create',
  authenticateValidator,
  authenticateAdministratorValidator,
  createVoucherValidator,
  wrapRequestHandler(createVoucherController)
)

export default router
