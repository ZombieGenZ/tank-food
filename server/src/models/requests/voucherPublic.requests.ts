export interface CreateVoucherRequestsBody {
  language?: string
  refresh_token: string
  code: string
  quantity: number
  discount: number
  requirement: number
  expiration_date: Date
}
