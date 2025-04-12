import express from 'express'
import {
  createVoucherPublicController,
  updateVoucherPublicController,
  deleteVoucherPublicController,
  getVoucherPublicController,
  storageVoucherPublicController
} from '~/controllers/voucherPublic.controllers'
import {
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorValidator
} from '~/middlewares/authenticate.middlewares'
import { languageValidator } from '~/middlewares/language.middlewares'
import {
  createVoucherPublicValidator,
  updateVoucherPublicValidator,
  deleteVoucherPublicValidator,
  storageVoucherPublicValidator
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorValidator,
  deleteVoucherPublicValidator,
  wrapRequestHandler(deleteVoucherPublicController)
)

/*
 * Description: Lấy mã giảm giá (Công khai) đã có trong CSDL
 * Path: /api/voucher-public/get-voucher
 * Method: POST
 * Body: {
 *    language?: string
 * }
 */
router.post(
  '/get-voucher',
  languageValidator,
  wrapRequestHandler(getVoucherPublicController)
)

/*
 * Description: Lưu mã giảm giá (Công khai)
 * Path: /api/voucher-public/storage-voucher
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    voucher_id: string
 * }
 */
router.post(
  '/storage-voucher',
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  storageVoucherPublicValidator,
  wrapRequestHandler(storageVoucherPublicController)
)

export default router
