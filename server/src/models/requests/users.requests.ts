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

export interface VerifyAccountRequestsBody {
  language?: string
  refresh_token: string
}

export interface ForgotPasswordRequestsBody {
  language?: string
  token: string
  new_password: string
  confirm_new_password: string
}
