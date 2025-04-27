// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import express from 'express'
import { getVoucherPrivateController } from '~/controllers/voucherPrivate.controllers'
import { authenticateValidator, authenticateVerifyAccountValidator } from '~/middlewares/authenticate.middlewares'
import { languageValidator } from '~/middlewares/language.middlewares'
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  wrapRequestHandler(getVoucherPrivateController)
)

export default router
