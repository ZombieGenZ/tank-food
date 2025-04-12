export interface CreateVoucherRequestsBody {
  language?: string
  code: string
  quantity: number
  discount: number
  requirement: number
  expiration_date: Date
}

export interface UpdateVoucherRequestsBody {
  language?: string
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

export interface GetVoucherPublicRequestsBody {
  language?: string
}

export interface StorageVoucherRequestsBody {
  language?: string
  voucher_id: string
}
