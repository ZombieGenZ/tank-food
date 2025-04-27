// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

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
