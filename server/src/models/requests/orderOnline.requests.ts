import { ProductList } from '~/constants/order.constants'

export interface OrderOnlineRequestsBody {
  language?: string
  product: ProductList[]
  name: string
  email: string
  phone: string
  receiving_longitude: number
  receiving_latitude: number
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
