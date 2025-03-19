import express from 'express'
import {
  orderOnlineController,
  checkoutOrderController,
  getNewOrderEmployeeController,
  getOldOrderEmployeeController,
  orderApprovalEmployeeController
} from '~/controllers/order.controllers'
import { authenticateEmployeeUploadImageValidator, authenticateValidator } from '~/middlewares/authenticate.middlewares'
import {
  orderOnlineValidator,
  voucherValidator,
  sepayApiKeyValidator,
  orderApprovalValidator
} from '~/middlewares/order.middlewares'
import { wrapRequestHandler } from '~/utils/handlers.utils'
const router = express.Router()

/*
 * Description: Tạo đơn đặt hàng trực tuyến mới
 * Path: /api/orders/order-online
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
 *    receiving_latitude: number,
 *    voucher?: string
 * }
 */
router.post(
  '/order-online',
  authenticateValidator,
  orderOnlineValidator,
  voucherValidator,
  wrapRequestHandler(orderOnlineController)
)

/*
 * Description: Endpoint để Sepay phản hồi kết quả thanh toán cho hệ thống
 * Path: /api/orders/checkout
 * Method: POST
 * headers: {
 *    authorization: Apikey <API Key>
 * },
 * Body: {
 *    id: number,
 *    gateway: string,
 *    transactionDate: string,
 *    accountNumber: string,
 *    code: string | null,
 *    content: string,
 *    transferType: string,
 *    transferAmount: number,
 *    accumulated: number,
 *    subAccount: number | null,
 *    referenceCode: string,
 *    description: string,
 *    voucher?: string
 * }
 */
router.post('/checkout', sepayApiKeyValidator, wrapRequestHandler(checkoutOrderController))

/*
 * Description: Lấy danh sách order đang chờ duyệt (cho nhân viên)
 * Path: /api/orders/get-new-order-employee
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
  '/get-new-order-employee',
  authenticateValidator,
  authenticateEmployeeUploadImageValidator,
  wrapRequestHandler(getNewOrderEmployeeController)
)

/*
 * Description: Lấy danh sách order đã xử lý (cho nhân viên)
 * Path: /api/orders/get-old-order-employee
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
  '/get-old-order-employee',
  authenticateValidator,
  authenticateEmployeeUploadImageValidator,
  wrapRequestHandler(getOldOrderEmployeeController)
)

/*
 * Description: Xử lý đơn hàng đang chờ xử lý
 * Path: /api/orders/order-approval
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    order_id: string,
 *    decision: boolean,
 *    reason: string
 * }
 */
router.post(
  '/order-approval',
  authenticateValidator,
  authenticateEmployeeUploadImageValidator,
  orderApprovalValidator,
  wrapRequestHandler(orderApprovalEmployeeController)
)

export default router
