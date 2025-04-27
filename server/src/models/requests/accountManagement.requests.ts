// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

export interface GetAccountRequestsBody {
  language?: string
}

export interface BanAccountRequestsBody {
  language?: string
  user_id: string
  reason: string
  time: string
}

export interface UnBanAccountRequestsBody {
  language?: string
  user_id: string
}
