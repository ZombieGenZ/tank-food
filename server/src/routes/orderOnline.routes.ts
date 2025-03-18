import express from 'express'
const router = express.Router()

/*
 * Description: Tạo đơn đặt hàng trực tuyến mới
 * Path: /api/order-online/order
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    product: [
 *      ...
 *      {
 *        product_id: string,
 *        quantity: number
 *      }
 *    ],
 *    name: string,
 *    email: string,
 *    phone: string,
 *    receiving_longitude: number,
 *    receiving_latitude: number
 * }
 */
router.post('/order', orderOnlineValidator)

export default router
