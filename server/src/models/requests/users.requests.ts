// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

export interface RegisterUserRequestsBody {
  language?: string
  display_name: string
  email: string
  phone: string
  password: string
  confirm_password: string
}

export interface LoginUserRequestsBody {
  language?: string
  email: string
  password: string
}

export interface LogoutUserRequestsBody {
  language?: string
  refresh_token: string
}

export interface VerifyEmailVerifyTokenRequestsBody {
  language?: string
  token: string
}

export interface VerifyAccountRequestsBody {
  language?: string
  refresh_token: string
}

export interface SendForgotPasswordRequestsBody {
  language?: string
  refresh_token: string
}

export interface VerifyForgotPasswordTokenRequestsBody {
  language?: string
  token: string
}

export interface ForgotPasswordRequestsBody {
  language?: string
  token: string
  new_password: string
  confirm_new_password: string
}

export interface ChangeInfomationRequestsBody {
  language?: string
  display_name: string
  phone: string
}

export interface ChangePasswordRequestsBody {
  language?: string
  password: string
  new_password: string
  confirm_new_password: string
}
