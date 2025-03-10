export interface RegisterUser {
  language?: string
  display_name: string
  email: string
  phone: string
  password: string
  confirm_password: string
}

export interface LoginUser {
  language?: string
  email: string
  password: string
}
