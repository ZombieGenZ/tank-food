import express from 'express'
import {
  createVoucherPublicController,
  updateVoucherPublicController,
  deleteVoucherPublicController,
  getVoucherPublicController
} from '~/controllers/voucherPublic.controllers'
import { authenticateAdministratorValidator, authenticateValidator } from '~/middlewares/authenticate.middlewares'
import {
  createVoucherPublicValidator,
  updateVoucherPublicValidator,
  deleteVoucherPublicValidator
} from '~/middlewares/voucherPublic.middlewares'
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
  createVoucherPublicValidator,
  wrapRequestHandler(createVoucherPublicController)
)

/*
 * Description: Cập nhật mã giảm giá (Công khai) đã có trong CSDL
 * Path: /api/voucher-public/update
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    voucher_id: string,
 *    code: string,
 *    quantity: number,
 *    discount: number,
 *    requirement: number.
 *    expiration_date: Date
 * }
 */
router.put(
  '/update',
  authenticateValidator,
  authenticateAdministratorValidator,
  updateVoucherPublicValidator,
  wrapRequestHandler(updateVoucherPublicController)
)

/*
 * Description: Xóa mã giảm giá (Công khai) đã có trong CSDL
 * Path: /api/voucher-public/delete
 * Method: DELETE
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    voucher_id: string
 * }
 */
router.delete(
  '/delete',
  authenticateValidator,
  authenticateAdministratorValidator,
  deleteVoucherPublicValidator,
  wrapRequestHandler(deleteVoucherPublicController)
)

/*
 * Description: Lấy mã giảm giá (Công khai) đã có trong CSDL
 * Path: /api/voucher-public/get-voucher
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
  authenticateAdministratorValidator,
  wrapRequestHandler(getVoucherPublicController)
)

export default router
