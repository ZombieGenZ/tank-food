import { ProductList } from '~/constants/order.constants'

export interface  OrderOnlineRequestsBody {
  language?: string,
  product: ProductList[],
  name: string,
  email: string,
  phone: string,
  receiving_longitude: number,
  receiving_latitude: number
}