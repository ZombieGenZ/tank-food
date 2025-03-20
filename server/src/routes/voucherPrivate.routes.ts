import express from 'express'
import { authenticateValidator } from '~/middlewares/authenticate.middlewares'
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
router.post('/get-voucher', authenticateValidator)

export default router
