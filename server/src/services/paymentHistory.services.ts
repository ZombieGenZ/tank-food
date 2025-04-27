// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { CheckoutOrderRequestBody } from '~/models/requests/orders.requests'
import databaseService from './database.services'
import PaymentHistory from '~/models/schemas/paymentHistory.schemas'

class PaymentHistoryService {
  async insertHistory(payload: CheckoutOrderRequestBody) {
    databaseService.paymentHistory.insertOne(
      new PaymentHistory({
        ...payload
      })
    )
  }
}

const paymentHistoryService = new PaymentHistoryService()
export default paymentHistoryService
