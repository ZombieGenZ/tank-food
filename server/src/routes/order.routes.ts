import express from 'express'
import {
  orderOnlineController,
  checkoutOrderController,
  getNewOrderEmployeeController,
  getOldOrderEmployeeController,
  orderApprovalEmployeeController,
  cancelOrderEmployeeController,
  getNewOrderShipperController,
  getOldOrderShipperController,
  receiveDeliveryShipperController
} from '~/controllers/order.controllers'
import {
  authenticateValidator,
  authenticateEmployeeValidator,
  authenticateShipperValidator
} from '~/middlewares/authenticate.middlewares'
import {
  orderOnlineValidator,
  voucherValidator,
  sepayApiKeyValidator,
  cancelOrderEmployeeValidator,
  orderApprovalValidator,
  receiveDeliveryValidator
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
 *    note?: string,
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
  authenticateEmployeeValidator,
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
  authenticateEmployeeValidator,
  wrapRequestHandler(getOldOrderEmployeeController)
)

/*
 * Description: Xử lý đơn hàng đang chờ xử lý
 * Path: /api/orders/order-approval
 * Method: PUT
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
router.put(
  '/order-approval',
  authenticateValidator,
  authenticateEmployeeValidator,
  orderApprovalValidator,
  wrapRequestHandler(orderApprovalEmployeeController)
)

/*
 * Description: Hủy đơn hàng đã nhận (cho nhân viên)
 * Path: /api/orders/cancel-order-employee
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    order_id: string,
 *    reason: string
 * }
 */
router.put(
  '/cancel-order-employee',
  authenticateValidator,
  authenticateEmployeeValidator,
  cancelOrderEmployeeValidator,
  wrapRequestHandler(cancelOrderEmployeeController)
)

/*
 * Description: Lấy danh sách order đang chờ nhận giao hàng (cho shipper)
 * Path: /api/orders/get-new-order-shipper
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
  '/get-new-order-shipper',
  authenticateValidator,
  authenticateShipperValidator,
  wrapRequestHandler(getNewOrderShipperController)
)

/*
 * Description: Lấy danh sách order đã nhận (cho shipper)
 * Path: /api/orders/get-old-order-shipper
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
  '/get-old-order-shipper',
  authenticateValidator,
  authenticateShipperValidator,
  wrapRequestHandler(getOldOrderShipperController)
)

/*
 * Description: Nhận giao hàng (cho shipper)
 * Path: /api/orders/receive-delivery
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    order_id: string
 * }
 */
router.put(
  '/receive-delivery',
  authenticateValidator,
  authenticateShipperValidator,
  receiveDeliveryValidator,
  wrapRequestHandler(receiveDeliveryShipperController)
)

export default router
