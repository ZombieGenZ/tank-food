export class VIETNAMESE_STATIC_MESSAGE {
  static SYSTEM_MESSAGE = {
    VALIDATION_ERROR: 'Lỗi dử liệu đầu vào'
  } as const

  static USER_MESSAGE = {
    DISPLAY_NAME_IS_REQUIRED: 'Không được bỏ trống tên hiển thị',
    DISPLAY_NAME_MUST_BE_A_STRING: 'Tên hiển thị phải là chuổi ký tự',
    DISPLAY_NAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Tên hiển thị phải có độ dài từ 1 đến 50 ký tự',
    EMAIL_IS_REQUIRED: 'Không được bỏ trống địa chỉ email',
    EMAIL_MUST_BE_A_STRING: 'Địa chỉ email phải là một chuổi ký tự',
    EMAIL_LENGTH_MUST_BE_FROM_5_TO_100: 'Địa chỉ email phải có độ dài từ 5 đến 100 ký tự',
    EMAIL_IS_NOT_VALID: 'Địa chỉ email không đúng định dạn',
    EMAIL_ALREADY_EXISTS: 'Địa chỉ email đã được sử dụng',
    PHONE_IS_REQUIRED: 'Không được bỏ trống số điện thoại',
    PHONE_MUST_BE_A_STRING: 'Số điện thoại phải là một chuổi ký tự',
    PHONE_LENGTH_MUST_BE_FROM_10_TO_11: 'Số điện thoại phải có độ dài từ 10 đến 11 ký tự',
    PHONE_IS_NOT_VALID: 'Số điện thoại không hợp lệ',
    PHONE_ALREADY_EXISTS: 'Số điện thoại đã được sử dụng',
    PASSWORD_IS_REQUIRED: 'Không được bỏ trống mật khẩu',
    PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là một chuổi ký tự',
    PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100: 'Mật khẩu phải có độ dài từ 8 đến 100 ký tự',
    PASSWORD_MUST_BE_STRONG: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
    CONFIRM_PASSWORD_IS_REQUIRED: 'Không được bỏ trống xác nhận mật khẩu',
    CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Xác nhận mật khẩu phải là một chuổi ký tự',
    CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100: 'Xác nhận mật khẩu phải có độ dài từ 8 đến 100 ký tự',
    CONFIRM_PASSWORD_MUST_BE_STRONG:
      'Xác nhận mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
    CONFIRM_PASSWORD_DOES_NOT_MATCH_PASSWORD: 'Xác nhận mật khẩu phải khớp với mật khẩu',
    REGISTER_SUCCESS: 'Đăng ký tài khoản thành công!',
    REGISTER_FAILURE: 'Đăng ký tài khoản thất bại',
    INCORRECT_EMAIL_OR_PASSWORD: 'Địa chỉ email hoặc mật khẩu không chính xác',
    LOGIN_SUCCESS: 'Đăng nhập tài khoản thành công!',
    LOGIN_FAILURE: 'Đăng nhập tài khoản thất bại',
    LOGOUT_SUCCESS: 'Đăng xuất tài khoản thành công!',
    LOGOUT_FAILURE: 'Đăng xuất tài khoản thất bại'
  } as const

  static AUTHENTICATE_MESSAGE = {
    ACCESS_TOKEN_IS_REQUIRED: 'Không được bỏ trống Access token',
    ACCESS_TOKEN_MUST_BE_A_STRING: 'Access token phải là một chuổi ký tự',
    ACCESS_TOKEN_INVALID: 'Access token không hợp lệ',
    USER_DOES_NOT_EXIST: 'Người dùng không tồn tại',
    REFRESH_TOKEN_IS_REQUIRED: 'Không được bỏ trống Refresh token',
    REFRESH_TOKEN_MUST_BE_A_STRING: 'Refresh token phải là một chuổi ký tự',
    REFRESH_TOKEN_INVALID: 'Refresh token không hợp lệ',
    AUTHENTICATION_FAILED: 'Yêu cầu xác thực trước khi thực hiện hành động này'
  } as const
}

export class ENGLISH_STATIC_MESSAGE {
  static SYSTEM_MESSAGE = {
    VALIDATION_ERROR: 'Invalid input data'
  } as const

  static USER_MESSAGE = {
    DISPLAY_NAME_IS_REQUIRED: 'Display name is required',
    DISPLAY_NAME_MUST_BE_A_STRING: 'Display name must be a string',
    DISPLAY_NAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Display name must be between 1 and 50 characters',
    EMAIL_IS_REQUIRED: 'Email is required',
    EMAIL_MUST_BE_A_STRING: 'Email must be a string',
    EMAIL_LENGTH_MUST_BE_FROM_5_TO_100: 'Email must be between 5 and 100 characters',
    EMAIL_IS_NOT_VALID: 'Email is not valid',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    PHONE_IS_REQUIRED: 'Phone number is required',
    PHONE_MUST_BE_A_STRING: 'Phone number must be a string',
    PHONE_LENGTH_MUST_BE_FROM_10_TO_11: 'Phone number must be between 10 and 11 digits',
    PHONE_IS_NOT_VALID: 'Phone number is not valid',
    PHONE_ALREADY_EXISTS: 'Phone number already exists',
    PASSWORD_IS_REQUIRED: 'Password is required',
    PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
    PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100: 'Password must be between 8 and 100 characters',
    PASSWORD_MUST_BE_STRONG:
      'Password must be at least 8 characters long, including uppercase, lowercase, numbers, and special characters',
    CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
    CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
    CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100: 'Confirm password must be between 8 and 100 characters',
    CONFIRM_PASSWORD_MUST_BE_STRONG:
      'Confirm password must be at least 8 characters long, including uppercase, lowercase, numbers, and special characters',
    CONFIRM_PASSWORD_DOES_NOT_MATCH_PASSWORD: 'Confirm password does not match password',
    REGISTER_SUCCESS: 'Account registration successful!',
    REGISTER_FAILURE: 'Account registration failed',
    INCORRECT_EMAIL_OR_PASSWORD: 'Incorrect email or password',
    LOGIN_SUCCESS: 'Account login successful!',
    LOGIN_FAILURE: 'Account login failed',
    LOGOUT_SUCCESS: 'Account logout successful!',
    LOGOUT_FAILURE: 'Account logout failed'
  } as const

  static AUTHENTICATE_MESSAGE = {
    ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
    ACCESS_TOKEN_MUST_BE_A_STRING: 'Access token must be a string',
    ACCESS_TOKEN_INVALID: 'Access token is invalid',
    USER_DOES_NOT_EXIST: 'User does not exist',
    REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
    REFRESH_TOKEN_MUST_BE_A_STRING: 'Refresh token must be a string',
    REFRESH_TOKEN_INVALID: 'Refresh token is invalid',
    AUTHENTICATION_FAILED: 'Authentication is required before performing this action'
  } as const
}

export class VIETNAMESE_DYNAMIC_MESSAGE {
  static UserRegistrationSuccessful(email: string, ip: string) {
    return `Thực hiện đăng ký tài khoản ${email} thành công (IP: ${ip})`
  }
  static UserRegistrationFailed(email: string, ip: string, err: unknown) {
    return `Thực hiện đăng ký tài khoản ${email} thất bại (IP: ${ip}) | Lỗi: ${err}`
  }
  static UserLoggedInSuccessfully(user_id: string, ip: string) {
    return `Thực hiện đăng nhập tài khoản ${user_id} thành công (IP: ${ip})`
  }
  static UserLoggedInFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện đăng nhập tài khoản ${user_id} thất bại (IP: ${ip}) | Lỗi: ${err}`
  }
  static UserLoggedOutSuccessfully(user_id: string, ip: string) {
    return `Thực hiện đăng xuất tài khoản ${user_id} thành công (IP: ${ip})`
  }
  static UserLoggedOutFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện đăng xuất tài khoản ${user_id} thất bại (IP: ${ip}) | Lỗi: ${err}`
  }
}

export class ENGLIS_DYNAMIC_MESSAGE {
  static UserRegistrationSuccessful(email: string, ip: string) {
    return `User registration for ${email} successful (IP: ${ip})`
  }
  static UserRegistrationFailed(email: string, ip: string, err: unknown) {
    return `User registration for ${email} failed (IP: ${ip}) | Error: ${err}`
  }
  static UserLoggedInSuccessfully(user_id: string, ip: string) {
    return `User login for account ${user_id} successful (IP: ${ip})`
  }
  static UserLoggedInFailed(user_id: string, ip: string, err: unknown) {
    return `User login for account ${user_id} failed (IP: ${ip}) | Error: ${err}`
  }
  static UserLoggedOutSuccessfully(user_id: string, ip: string) {
    return `User logout for account ${user_id} successful (IP: ${ip})`
  }
  static UserLoggedOutFailed(user_id: string, ip: string, err: unknown) {
    return `User logout for account ${user_id} failed (IP: ${ip}) | Error: ${err}`
  }
}
