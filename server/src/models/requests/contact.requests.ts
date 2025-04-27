// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

export interface SendContactRequestsBody {
  language?: string
  name: string
  email: string
  phone: string
  title: string
  content: string
}

export interface ResponseContactRequestsBody {
  language?: string
  contact_id: string
  user_id: string
  reply_content: string
  timestamp: Date
}
