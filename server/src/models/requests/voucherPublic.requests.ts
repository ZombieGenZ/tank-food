export interface CreateVoucherRequestsBody {
  language?: string
  refresh_token: string
  code: string
  quantity: number
  discount: number
  requirement: number
  expiration_date: Date
}

export interface UpdateVoucherRequestsBody {
  language?: string
  refresh_token: string
  voucher_id: string
  code: string
  quantity: number
  discount: number
  requirement: number
  expiration_date: Date
}

export interface DeleteVoucherRequestsBody {
  language?: string
  refresh_token: string
  voucher_id: string
}

export interface GetVoucherRequestsBody {
  language?: string
}

export interface FindVoucherRequestsBody {
  language?: string
  keywords: string
}
