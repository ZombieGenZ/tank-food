import express from 'express'
import {
  orderOnlineController,
  checkoutOrderController,
  getNewOrderEmployeeController,
  getOldOrderEmployeeController,
  orderApprovalEmployeeController,
  cancelOrderEmployeeController,
  orderCompletionConfirmationController,
  getNewOrderShipperController,
  getOldOrderShipperController,
  receiveDeliveryShipperController,
  cancelOrderShipperController,
  confirmDeliveryCompletionController,
  orderOfflineController,
  paymentConfirmationController,
  getOrderController,
  cancelOrderController,
  getOrderOverViewController,
  getPaymentInfomationController
} from '~/controllers/orders.controllers'
import {
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateEmployeeValidator,
  authenticateShipperValidator,
  authenticateAdministratorValidator
} from '~/middlewares/authenticate.middlewares'
import { languageValidator } from '~/middlewares/language.middlewares'
import {
  orderOnlineValidator,
  voucherPublicAndPrivateValidator,
  sepayApiKeyValidator,
  cancelOrderEmployeeValidator,
  orderCompletionConfirmationValidator,
  orderApprovalValidator,
  receiveDeliveryValidator,
  cancelOrderShipperValidator,
  confirmDeliveryCompletionValidator,
  orderOfflineValidator,
  voucherPublicValidator,
  paymentConfirmationValidator,
  cancelOrderValidator,
  getPaymentInfomationValidator
} from '~/middlewares/orders.middlewares'
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
 *    products: [
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  orderOnlineValidator,
  voucherPublicAndPrivateValidator,
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateEmployeeValidator,
  cancelOrderEmployeeValidator,
  wrapRequestHandler(cancelOrderEmployeeController)
)

/*
 * Description: Xác nhận hoàn thành đơn hàng (cho nhân viên)
 * Path: /api/orders/order-completion-confirmation
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
  '/order-completion-confirmation',
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateEmployeeValidator,
  orderCompletionConfirmationValidator,
  wrapRequestHandler(orderCompletionConfirmationController)
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
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
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateShipperValidator,
  receiveDeliveryValidator,
  wrapRequestHandler(receiveDeliveryShipperController)
)

/*
 * Description: Hủy đơn hàng đã nhận (cho shipper)
 * Path: /api/orders/cancel-order-shipper
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
  '/cancel-order-shipper',
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateEmployeeValidator,
  cancelOrderShipperValidator,
  wrapRequestHandler(cancelOrderShipperController)
)

/*
 * Description: Xác nhận hoàn thành đơn giao hàng (cho shipper)
 * Path: /api/orders/confirm-delivery-completion
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
  '/confirm-delivery-completion',
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateShipperValidator,
  confirmDeliveryCompletionValidator,
  wrapRequestHandler(confirmDeliveryCompletionController)
)

/*
 * Description: Tạo đơn đặt hàng tại quầy mới
 * Path: /api/orders/order-offline
 * Method: POST
 * Body: {
 *    language?: string,
 *    products: [
 *      ...
 *      {
 *        product_id: string,
 *        quantity: number
 *      }
 *    ],
 *    payment_type: number,
 *    voucher?: string
 * }
 */
router.post(
  '/order-offline',
  languageValidator,
  orderOfflineValidator,
  voucherPublicValidator,
  wrapRequestHandler(orderOfflineController)
)

/*
 * Description: Xác nhận thanh toán (Dành cho order trả bằng tiền mặt)
 * Path: /api/orders/payment-confirmation
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
  '/payment-confirmation',
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateEmployeeValidator,
  paymentConfirmationValidator,
  wrapRequestHandler(paymentConfirmationController)
)

/*
 * Description: Lấy danh sách order (cho user)
 * Path: /api/orders/get-order
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
  '/get-order',
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  wrapRequestHandler(getOrderController)
)

/*
 * Description: Hủy đơn hàng (cho user)
 * Path: /api/orders/cancel-order
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
  '/cancel-order',
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  cancelOrderValidator,
  wrapRequestHandler(cancelOrderController)
)

/*
 * Description: Lấy danh sách order tổng quan
 * Path: /api/orders/get-order-overview
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
  '/get-order-overview',
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorValidator,
  wrapRequestHandler(getOrderOverViewController)
)

/*
 * Description: Lấy thông tin thanh toán
 * Path: /api/orders/get-payment-infomation
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    order_id: string
 * }
 */
router.post(
  '/get-payment-infomation',
  languageValidator,
  authenticateValidator,
  authenticateVerifyAccountValidator,
  getPaymentInfomationValidator,
  wrapRequestHandler(getPaymentInfomationController)
)

export default router
