import { ObjectId } from 'mongodb'
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
