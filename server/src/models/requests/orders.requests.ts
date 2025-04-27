// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { ProductList } from '~/constants/orders.constants'

export interface OrderOnlineRequestsBody {
  language?: string
  product: ProductList[]
  name: string
  email: string
  phone: string
  receiving_longitude: number
  receiving_latitude: number
  voucher?: string
  note?: string
}

export interface CheckoutOrderRequestBody {
  language: string
  id: number
  gateway: string
  transactionDate: string
  accountNumber: string
  code: string | null
  content: string
  transferType: string
  transferAmount: number
  accumulated: number
  subAccount: number | null
  referenceCode: string
  description: string
}

export interface GetOrderRequestsBody {
  language: string
}

export interface OrderApprovalRequestsBody {
  language: string
  decision: boolean
  reason: string
}

export interface CancelOrderEmployeeRequestsBody {
  language: string
  reason: string
}

export interface ReceiveDeliveryRequestsBody {
  language: string
  order_id: string
}

export interface CancelOrderShipperRequestsBody {
  language: string
  order_id: string
}

export interface OrderOfflineRequestsBody {
  language?: string
  product: ProductList[]
  payment_type: number
  voucher?: string
}

export interface PaymentConfirmationRequestsBody {
  language: string
  order_id: string
}

export interface OrderCompletionConfirmationRequestsBody {
  language: string
  order_id: string
}

export interface ConfirmDeliveryCompletionRequestsBody {
  language: string
  order_id: string
}

export interface CancelOrderRequestsBody {
  language: string
  order_id: string
}

export interface GetPaymentInfomationRequestsBody {
  language: string
  order_id: string
}
