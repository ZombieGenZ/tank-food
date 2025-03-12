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
    REGISTER_SUCCESS: 'Đăng ký tài khoản thành công',
    REGISTER_FAILURE: 'Đăng ký tài khoản thất bại',
    INCORRECT_EMAIL_OR_PASSWORD: 'Địa chỉ email hoặc mật khẩu không chính xác',
    LOGIN_SUCCESS: 'Đăng nhập tài khoản thành công',
    LOGIN_FAILURE: 'Đăng nhập tài khoản thất bại',
    LOGOUT_SUCCESS: 'Đăng xuất tài khoản thành công',
    LOGOUT_FAILURE: 'Đăng xuất tài khoản thất bại',
    VERIFY_TOKEN_SUCCESS: 'Xác thực token thành công',
    VERIFY_TOKEN_FAILURE: 'Xác thực token thất bại'
  } as const

  static AUTHENTICATE_MESSAGE = {
    ACCESS_TOKEN_IS_REQUIRED: 'Không được bỏ trống Access token',
    ACCESS_TOKEN_MUST_BE_A_STRING: 'Access token phải là một chuổi ký tự',
    ACCESS_TOKEN_INVALID: 'Access token không hợp lệ',
    USER_DOES_NOT_EXIST: 'Người dùng không tồn tại',
    REFRESH_TOKEN_IS_REQUIRED: 'Không được bỏ trống Refresh token',
    REFRESH_TOKEN_MUST_BE_A_STRING: 'Refresh token phải là một chuổi ký tự',
    REFRESH_TOKEN_INVALID: 'Refresh token không hợp lệ',
    AUTHENTICATION_FAILED: 'Yêu cầu xác thực trước khi thực hiện hành động này',
    YOU_DONT_HAVE_PERMISSION_TO_DO_THIS: 'Bạn không có quyền làm điều này'
  } as const

  static CATEGORY_MESSAGE = {
    CATEGORY_NAME_IS_REQUIRED: 'Không được bỏ trống tên danh mục',
    CATEGORY_NAME_MUST_BE_A_STRING: 'Tên danh mục phải là một chuổi ký tự',
    CATEGORY_NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Tên danh mục phải có độ dài từ 1 đến 100 ký tự',
    INDEX_IS_REQUIRED: 'Không được bỏ trống độ ưu tiên của danh mục',
    INDEX_MUST_BE_A_NUMBER: 'Độ ưu tiên của danh mục phải là một chuổi ký tự',
    CREATE_CATEGORY_SUCCESS: 'Tạo danh mục thành công',
    CREATE_CATEGORY_FAILURE: 'Tạo danh mục thất bại',
    CATEGORY_ID_IS_REQUIRED: 'Không được bỏ trống ID danh mục',
    CATEGORY_ID_MUST_BE_A_STRING: 'ID Danh mục phải là một chuổi ký tự',
    CATEGORY_ID_IS_MUST_BE_A_ID: 'ID Danh mục không đúng định dạn',
    CATEGORY_ID_DOES_NOT_EXIST: 'ID Danh mục không tồn tại',
    UPDATE_CATEGORY_SUCCESS: 'Cập nhật danh mục thành công',
    UPDATE_CATEGORY_FAILURE: 'Cập nhật danh mục thất bại',
    DELETE_CATEGORY_SUCCESS: 'Xóa danh mục thành công',
    DELETE_CATEGORY_FAILURE: 'Xóa danh mục thất bại',
    GET_CATEGORY_SUCCESS: 'Lấy thông tin danh mục thành công',
    GET_CATEGORY_FAILURE: 'Lấy thông tin danh mục thất bại',
    FIND_CATEGORY_SUCCESS: 'Tìm kiếm thông tin danh mục thành công',
    FIND_CATEGORY_FAILURE: 'Tìm kiếm thông tin danh mục thất bại',
    KEYWORD_IS_REQUIRED: 'Không được bỏ trống từ khóa tìm kiếm',
    KEYWORD_MUST_BE_A_STRING: 'Từ khóa tìm kiếm phải là một chuổi ký'
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
    REGISTER_SUCCESS: 'Account registration successful',
    REGISTER_FAILURE: 'Account registration failed',
    INCORRECT_EMAIL_OR_PASSWORD: 'Incorrect email or password',
    LOGIN_SUCCESS: 'Account login successful',
    LOGIN_FAILURE: 'Account login failed',
    LOGOUT_SUCCESS: 'Account logout successful',
    LOGOUT_FAILURE: 'Account logout failed',
    VERIFY_TOKEN_SUCCESS: 'Token verification successful',
    VERIFY_TOKEN_FAILURE: 'Token verification failed'
  } as const

  static AUTHENTICATE_MESSAGE = {
    ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
    ACCESS_TOKEN_MUST_BE_A_STRING: 'Access token must be a string',
    ACCESS_TOKEN_INVALID: 'Access token is invalid',
    USER_DOES_NOT_EXIST: 'User does not exist',
    REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
    REFRESH_TOKEN_MUST_BE_A_STRING: 'Refresh token must be a string',
    REFRESH_TOKEN_INVALID: 'Refresh token is invalid',
    AUTHENTICATION_FAILED: 'Authentication is required before performing this action',
    YOU_DONT_HAVE_PERMISSION_TO_DO_THIS: 'You do not have permission to do this'
  } as const

  static CATEGORY_MESSAGE = {
    CATEGORY_NAME_IS_REQUIRED: 'Category name is required',
    CATEGORY_NAME_MUST_BE_A_STRING: 'Category name must be a string',
    CATEGORY_NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Category name must be between 1 and 100 characters',
    INDEX_IS_REQUIRED: 'Category index is required',
    INDEX_MUST_BE_A_NUMBER: 'Category index must be a number',
    CREATE_CATEGORY_SUCCESS: 'Category created successfully',
    CREATE_CATEGORY_FAILURE: 'Category creation failed',
    CATEGORY_ID_IS_REQUIRED: 'Category ID is required',
    CATEGORY_ID_MUST_BE_A_STRING: 'Category ID must be a string',
    CATEGORY_ID_IS_MUST_BE_A_ID: 'Category ID is invalid',
    CATEGORY_ID_DOES_NOT_EXIST: 'Category ID does not exist',
    UPDATE_CATEGORY_SUCCESS: 'Category updated successfully',
    UPDATE_CATEGORY_FAILURE: 'Category update failed',
    DELETE_CATEGORY_SUCCESS: 'Category deleted successfully',
    DELETE_CATEGORY_FAILURE: 'Category deletion failed',
    GET_CATEGORY_SUCCESS: 'Category information retrieved successfully',
    GET_CATEGORY_FAILURE: 'Category information retrieval failed',
    FIND_CATEGORY_SUCCESS: 'Category information search successful',
    FIND_CATEGORY_FAILURE: 'Category information search failed',
    KEYWORD_IS_REQUIRED: 'Search keyword is required',
    KEYWORD_MUST_BE_A_STRING: 'Search keyword must be a string'
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
  static UserVerifyTokenSuccessfully(user_id: string, ip: string) {
    return `Thực hiện xác thực token truy cập người dùng ${user_id} thành công (IP: ${ip})`
  }
  static UserVerifyTokenFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện xác thực token truy cập người dùng ${user_id} thất bại (IP: ${ip}) | Lỗi: ${err}`
  }
  static CategoryCreateSuccessfully(user_id: string, ip: string) {
    return `Thực hiện tạo danh mục thành công (User: ${user_id}) (IP: ${ip})`
  }
  static CategoryCreateFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện tạo danh mục thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static CategoryUpdateSuccessfully(user_id: string, ip: string) {
    return `Thực hiện cập nhật danh mục thành công (User: ${user_id}) (IP: ${ip})`
  }
  static CategoryUpdateFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện cập nhật danh mục thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static CategoryDeleteSuccessfully(user_id: string, ip: string) {
    return `Thực hiện xóa danh mục thành công (User: ${user_id}) (IP: ${ip})`
  }
  static CategoryDeleteFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện xóa danh mục thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static GetCategorySuccessfully(user_id: string, ip: string) {
    return `Thực hiện lấy thông tin danh mục thành công (User: ${user_id}) (IP: ${ip})`
  }
  static GetCategoryFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện lấy thông tin danh mục thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static FindCategorySuccessfully(user_id: string, ip: string) {
    return `Thực hiện tìm kiếm thông tin danh mục thành công (User: ${user_id}) (IP: ${ip})`
  }
  static FindCategoryFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện tìm kiếm thông tin danh mục thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
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
  static UserVerifyTokenSuccessfully(user_id: string, ip: string) {
    return `User access token verification for user ${user_id} successful (IP: ${ip})`
  }
  static UserVerifyTokenFailed(user_id: string, ip: string, err: unknown) {
    return `User access token verification for user ${user_id} failed (IP: ${ip}) | Error: ${err}`
  }
  static CategoryCreateSuccessfully(user_id: string, ip: string) {
    return `Category creation successful (User: ${user_id}) (IP: ${ip})`
  }
  static CategoryCreateFailed(user_id: string, ip: string, err: unknown) {
    return `Category creation failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static CategoryUpdateSuccessfully(user_id: string, ip: string) {
    return `Category update successful (User: ${user_id}) (IP: ${ip})`
  }
  static CategoryUpdateFailed(user_id: string, ip: string, err: unknown) {
    return `Category update failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static CategoryDeleteSuccessfully(user_id: string, ip: string) {
    return `Category deletion successful (User: ${user_id}) (IP: ${ip})`
  }
  static CategoryDeleteFailed(user_id: string, ip: string, err: unknown) {
    return `Category deletion failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static GetCategorySuccessfully(user_id: string, ip: string) {
    return `Category information retrieval successful (User: ${user_id}) (IP: ${ip})`
  }
  static GetCategoryFailed(user_id: string, ip: string, err: unknown) {
    return `Category information retrieval failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static FindCategorySuccessfully(user_id: string, ip: string) {
    return `Category information search successful (User: ${user_id}) (IP: ${ip})`
  }
  static FindCategoryFailed(user_id: string, ip: string, err: unknown) {
    return `Category information search failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
}
