import { formatDateFull2 } from '~/utils/date.utils'

export class VIETNAMESE_STATIC_MESSAGE {
  static SYSTEM_MESSAGE = {
    VALIDATION_ERROR: 'Lỗi dữ liệu đầu vào'
  } as const

  static USER_MESSAGE = {
    DISPLAY_NAME_IS_REQUIRED: 'Không được bỏ trống tên hiển thị',
    DISPLAY_NAME_MUST_BE_A_STRING: 'Tên hiển thị phải là chuỗi ký tự',
    DISPLAY_NAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Tên hiển thị phải có độ dài từ 1 đến 50 ký tự',
    EMAIL_IS_REQUIRED: 'Không được bỏ trống địa chỉ email',
    EMAIL_MUST_BE_A_STRING: 'Địa chỉ email phải là một chuỗi ký tự',
    EMAIL_LENGTH_MUST_BE_FROM_5_TO_100: 'Địa chỉ email phải có độ dài từ 5 đến 100 ký tự',
    EMAIL_IS_NOT_VALID: 'Địa chỉ email không đúng định dạng',
    EMAIL_ALREADY_EXISTS: 'Địa chỉ email đã được sử dụng',
    EMAIL_NOT_FOUND: 'Email không tồn tại',
    PHONE_IS_REQUIRED: 'Không được bỏ trống số điện thoại',
    PHONE_MUST_BE_A_STRING: 'Số điện thoại phải là một chuỗi ký tự',
    PHONE_LENGTH_MUST_BE_FROM_10_TO_11: 'Số điện thoại phải có độ dài từ 10 đến 11 ký tự',
    PHONE_IS_NOT_VALID: 'Số điện thoại không hợp lệ',
    PHONE_ALREADY_EXISTS: 'Số điện thoại đã được sử dụng',
    PASSWORD_IS_REQUIRED: 'Không được bỏ trống mật khẩu',
    PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là một chuỗi ký tự',
    PASSWORD_LENGTH_MUST_BE_FROM_8_TO_100: 'Mật khẩu phải có độ dài từ 8 đến 100 ký tự',
    PASSWORD_MUST_BE_STRONG: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
    CONFIRM_PASSWORD_IS_REQUIRED: 'Không được bỏ trống xác nhận mật khẩu',
    CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Xác nhận mật khẩu phải là một chuỗi ký tự',
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
    VERIFY_TOKEN_FAILURE: 'Xác thực token thất bại',
    GET_USER_INFORMATION_SUCCESS: 'Lấy thông tin người dùng thành công',
    GET_USER_INFORMATION_FAILURE: 'Lấy thông tin người dùng thất bại',
    SEND_EMAIL_VERIFY_SUCCESS: 'Gửi thư xác nhận tài khoản thành công',
    SEND_EMAIL_VERIFY_FAILURE: 'Gửi thư xác nhận tài khoản thất bại',
    ACCOUNT_IS_VERIFIED: 'Tài khoản của bạn đã được xác thực',
    ACCOUNT_IS_NOT_VERIFIED: 'Tài khoản của bạn chưa được xác thực',
    TOKEN_IS_REQUIRED: 'Không được bỏ trống token',
    TOKEN_MUST_BE_A_STRING: 'Token phải là một chuỗi kí tự',
    TOKEN_INVALID: 'Token không hợp lệ',
    PASSWORD_CONFIRM_NOT_MATCH: 'Mật khẩu xác nhận phải trùng với mật khẩu mới',
    VERIFY_ACCOUNT_SUCCESS: 'Xác thực tài khoản thành công',
    VERIFY_ACCOUNT_FAILURE: 'Xác thực tài khoản thất bại',
    SEND_MAIL_FORGOT_PASSWORD_SUCCESS: 'Gửi yêu cầu đặt lại mật khẩu thành công',
    SEND_MAIL_FORGOT_PASSWORD_FAILURE: 'Gửi yêu cầu đặt lại mật khẩu thất bại',
    FORGOT_PASSWORD_SUCCESS: 'Cập nhật mật khẩu thành công',
    FORGOT_PASSWORD_FAILURE: 'Cập nhật mật khẩu thất bại'
  } as const

  static AUTHENTICATE_MESSAGE = {
    ACCESS_TOKEN_IS_REQUIRED: 'Không được bỏ trống Access token',
    ACCESS_TOKEN_MUST_BE_A_STRING: 'Access token phải là một chuỗi ký tự',
    ACCESS_TOKEN_INVALID: 'Access token không hợp lệ',
    USER_DOES_NOT_EXIST: 'Người dùng không tồn tại',
    REFRESH_TOKEN_IS_REQUIRED: 'Không được bỏ trống Refresh token',
    REFRESH_TOKEN_MUST_BE_A_STRING: 'Refresh token phải là một chuỗi ký tự',
    REFRESH_TOKEN_INVALID: 'Refresh token không hợp lệ',
    AUTHENTICATION_FAILED: 'Yêu cầu xác thực trước khi thực hiện hành động này',
    YOU_DONT_HAVE_PERMISSION_TO_DO_THIS: 'Bạn không có quyền làm điều này'
  } as const

  static CATEGORY_MESSAGE = {
    CATEGORY_NAME_IS_REQUIRED: 'Không được bỏ trống tên danh mục',
    CATEGORY_NAME_MUST_BE_A_STRING: 'Tên danh mục phải là một chuỗi ký tự',
    CATEGORY_NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Tên danh mục phải có độ dài từ 1 đến 100 ký tự',
    INDEX_IS_REQUIRED: 'Không được bỏ trống độ ưu tiên của danh mục',
    INDEX_MUST_BE_A_NUMBER: 'Độ ưu tiên của danh mục phải là một chuỗi ký tự',
    CREATE_CATEGORY_SUCCESS: 'Tạo danh mục thành công',
    CREATE_CATEGORY_FAILURE: 'Tạo danh mục thất bại',
    CATEGORY_ID_IS_REQUIRED: 'Không được bỏ trống ID danh mục',
    CATEGORY_ID_MUST_BE_A_STRING: 'ID Danh mục phải là một chuỗi ký tự',
    CATEGORY_ID_IS_MUST_BE_A_ID: 'ID Danh mục không đúng định dạng',
    CATEGORY_ID_DOES_NOT_EXIST: 'ID Danh mục không tồn tại',
    UPDATE_CATEGORY_SUCCESS: 'Cập nhật danh mục thành công',
    UPDATE_CATEGORY_FAILURE: 'Cập nhật danh mục thất bại',
    DELETE_CATEGORY_SUCCESS: 'Xóa danh mục thành công',
    DELETE_CATEGORY_FAILURE: 'Xóa danh mục thất bại',
    GET_CATEGORY_SUCCESS: 'Lấy thông tin danh mục thành công',
    GET_CATEGORY_FAILURE: 'Lấy thông tin danh mục thất bại',
    KEYWORD_IS_REQUIRED: 'Không được bỏ trống từ khóa tìm kiếm',
    KEYWORD_MUST_BE_A_STRING: 'Từ khóa tìm kiếm phải là một chuỗi ký tự'
  } as const

  static PRODUCT_MESSAGE = {
    PRODUCT_NAME_IS_REQUIRED: 'Không được bỏ trống tên sản phẩm',
    PRODUCT_NAME_MUST_BE_A_STRING: 'Tên sản phẩm phải là một chuỗi ký tự',
    PRODUCT_NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Tên sản phẩm phải có độ dài từ 1 đến 100 ký tự',
    PRODUCT_DESCRIPTION_IS_REQUIRED: 'Không được bỏ trống mô tả sản phẩm',
    PRODUCT_DESCRIPTION_MUST_BE_A_STRING: 'Mô tả sản phẩm phải là một chuỗi ký tự',
    PRODUCT_DESCRIPTION_LENGTH_MUST_BE_FROM_1_TO_1000: 'Mô tả sản phẩm phải có độ dài từ 1 đến 1000 ký tự',
    PRODUCT_PRICE_IS_REQUIRED: 'Không được bỏ trống giá sản phẩm',
    PRODUCT_PRICE_MUST_BE_A_NUMBER: 'Giá sản phẩm phải là một số',
    PRODUCT_PRICE_MUST_BE_GREATER_THAN_0: 'Giá sản phẩm phải lớn hơn 0',
    PRODUCT_AVAILABILITY_IS_REQUIRED: 'Không được bỏ trống tình trạng hàng',
    PRODUCT_AVAILABILITY_MUST_BE_A_BOOLEAN: 'Tình trạng hàng phải là một boolean',
    PRODUCT_CATEGORY_IS_REQUIRED: 'Không được bỏ trống danh mục sản phẩm',
    PRODUCT_CATEGORY_MUST_BE_A_STRING: 'Danh mục sản phẩm phải là một chuỗi ký tự',
    PRODUCT_CATEGORY_MUST_BE_A_ID: 'Danh mục sản phẩm không đúng định dạng',
    PRODUCT_CATEGORY_DOES_NOT_EXIST: 'Danh mục sản phẩm không tồn tại',
    PRODUCT_PREVIEW_IS_REQUIRED: 'Không được bỏ trống ảnh sản phẩm',
    CREATE_PRODUCT_SUCCESS: 'Tạo sản phẩm thành công',
    CREATE_PRODUCT_FAILURE: 'Tạo sản phẩm thất bại',
    PRODUCT_ID_IS_REQUIRED: 'Không được bỏ trống ID sản phẩm',
    PRODUCT_ID_MUST_BE_A_STRING: 'ID sản phẩm phải là một chuỗi ký tự',
    PRODUCT_ID_MUST_BE_A_ID: 'ID sản phẩm không đúng định dạng',
    PRODUCT_DOES_NOT_EXIST: 'ID sản phẩm không tồn tại',
    UPDATE_PRODUCT_SUCCESS: 'Cập nhật sản phẩm thành công',
    UPDATE_PRODUCT_FAILURE: 'Cập nhật sản phẩm thất bại',
    DELETE_PRODUCT_SUCCESS: 'Xóa sản phẩm thành công',
    DELETE_PRODUCT_FAILURE: 'Xóa sản phẩm thất bại',
    GET_PRODUCT_SUCCESS: 'Lấy thông tin sản phẩm thành công',
    GET_PRODUCT_FAILURE: 'Lấy thông tin sản phẩm thất bại',
    KEYWORD_IS_REQUIRED: 'Không được bỏ trống từ khóa tìm kiếm',
    KEYWORD_MUST_BE_A_STRING: 'Từ khóa tìm kiếm phải là một chuỗi ký tự'
  } as const

  static VOUCHER_MESSAGE = {
    CODE_IS_REQUIRED: 'Không được bỏ trống mã giảm giá',
    CODE_MUST_BE_A_STRING: 'Mã giảm giá phải là một chuỗi ký tự',
    CODE_LENGTH_MUST_BE_FROM_1_TO_50: 'Mã giảm giá phải có độ dài từ 1 đến 50 ký tự',
    CODE_ALREADY_EXISTS: 'Mã giảm giá đã được tồn tại',
    VOUCHER_QUANTITY_IS_REQUIRED: 'Không được bỏ trống số lượng mã giảm giá',
    VOUCHER_QUANTITY_MUST_BE_A_NUMBER: 'Số lượng mã giảm giá phải là một số',
    PRODUCT_QUANTITY_MUST_BE_GREATER_THAN_0: 'Số lượng mã giảm giá phải lớn hơn 0',
    VOUCHER_DISCOUNT_IS_REQUIRED: 'Không được bỏ trống giá tiền giảm giá',
    VOUCHER_DISCOUNT_MUST_BE_A_NUMBER: 'Giá tiền giảm giá phải là một số',
    PRODUCT_DISCOUNT_MUST_BE_GREATER_THAN_0: 'Giá tiền giảm giá phải lớn hơn 0',
    VOUCHER_REQUIREMENT_IS_REQUIRED: 'Không được bỏ trống yêu cầu mã giảm giá',
    VOUCHER_REQUIREMENT_MUST_BE_A_NUMBER: 'Yêu cầu mã giảm giá phải là một số',
    PRODUCT_REQUIREMENT_MUST_BE_GREATER_THAN_0: 'Yêu cầu mã giảm giá phải lớn hơn 0',
    VOUCHER_EXPIRATION_IS_REQUIRED: 'Không được bỏ trống ngày hết hạn',
    VOUCHER_EXPIRATION_IS_NOT_VALID: 'Ngày hết hạn không hợp lệ',
    PRODUCT_EXPIRATION_MUST_BE_GREATER_THAN_CURRENT_DATE: 'Ngày hết hạn phải lớn hơn ngày hiện tại',
    CREATE_VOUCHER_SUCCESS: 'Tạo mã giảm giá thành công',
    CREATE_VOUCHER_FAILURE: 'Tạo mã giảm giá thất bại',
    VOUCHER_ID_REQUIRED: 'Không được bỏ trống ID mã giảm giá',
    VOUCHER_ID_MUST_BE_A_STRING: 'ID mã giảm giá phải là một chuỗi ký tự',
    VOUCHER_ID_MUST_BE_A_ID: 'ID mã giảm giá không đúng định dạng',
    VOUCHER_DOES_NOT_EXIST: 'ID mã giảm giá không tồn tại',
    UPDATE_VOUCHER_SUCCESS: 'Cập nhật mã giảm giá thành công',
    UPDATE_VOUCHER_FAILURE: 'Cập nhật mã giảm giá thất bại',
    DELETE_VOUCHER_SUCCESS: 'Xóa mã giảm giá thành công',
    DELETE_VOUCHER_FAILURE: 'Xóa mã giảm giá thất bại',
    KEYWORD_IS_REQUIRED: 'Không được bỏ trống từ khóa tìm kiếm',
    KEYWORD_MUST_BE_A_STRING: 'Từ khóa tìm kiếm phải là một chuỗi ký',
    GET_VOUCHER_SUCCESS: 'Lấy thông tin mã giảm giá thành công',
    GET_VOUCHER_FAILURE: 'Lấy thông tin mã giảm giá thất bại',
    CODE_MUST_BE_A_STRING_WITHOUT_SPECIAL_CHARACTERS:
      'Mã voucher chỉ được chứa chữ hoa, chữ thường, số và dấu gạch dưới (_)'
  } as const

  static ORDER_MESSAGE = {
    ORDER_PRODUCT_IS_REQUIRED: 'Không được bỏ trống sản phẩm đặt hàng',
    ORDER_PRODUCT_MUST_BE_AN_ARRAY: 'Sản phẩm đặt hàng phải là một mảng',
    ORDER_PRODUCT_QUANTITY_MUST_BE_A_NUMBER_GREATER_THAN_0: 'Số lượng sản phẩm đặt hàng phải là một số lớn hơn 0',
    ORDER_PRODUCT_IS_NOT_FOUND: 'Sản phẩm đặt hàng không tồn tại',
    ORDER_PRODUCT_IS_NOT_AVAILABLE: 'Sản phẩm đặt hàng không còn hàng',
    ORDER_NAME_IS_REQUIRED: 'Không được bỏ trống tên khách hàng',
    ORDER_NAME_MUST_BE_A_STRING: 'Tên khách hàng phải là một chuỗi ký tự',
    ORDER_NAME_MUST_BE_BETWEEN_5_AND_100_CHARACTERS: 'Tên khách hàng phải có độ dài từ 5 đến 100 ký tự',
    ORDER_EMAIL_IS_REQUIRED: 'Không được bỏ trống email khách hàng',
    ORDER_EMAIL_MUST_BE_A_STRING: 'Email khách hàng phải là một chuỗi ký tự',
    ORDER_EMAIL_MUST_BE_BETWEEN_5_AND_100_CHARACTERS: 'Email khách hàng phải có độ dài từ 5 đến 100 ký tự',
    ORDER_EMAIL_IS_NOT_VALID: 'Email khách hàng không hợp lệ',
    ORDER_PHONE_IS_REQUIRED: 'Không được bỏ trống số điện thoại khách hàng',
    ORDER_PHONE_MUST_BE_A_STRING: 'Số điện thoại khách hàng phải là một chuỗi ký tự',
    ORDER_PHONE_MUST_BE_BETWEEN_10_AND_11_CHARACTERS: 'Số điện thoại khách hàng phải có độ dài từ 10 đến 11 ký tự',
    ORDER_PHONE_IS_NOT_VALID: 'Số điện thoại khách hàng không hợp lệ',
    ORDER_LATITUDE_MUST_BE_A_NUMBER_BETWEEN_MINUS_90_AND_90: 'Vĩ độ phải là một số từ -90 đến 90',
    ORDER_LATITUDE_IS_REQUIRED: 'Không được bỏ trống vĩ độ',
    ORDER_LONGITUDE_MUST_BE_A_NUMBER_BETWEEN_MINUS_180_AND_180: 'Kinh độ phải là một số từ -180 đến 180',
    ORDER_LONGITUDE_IS_REQUIRED: 'Không được bỏ trống kinh độ',
    CREATE_ORDER_SUCCESS: 'Tạo đơn hàng thành công',
    CREATE_ORDER_FAILURE: 'Tạo đơn hàng thất bại',
    API_KEY_REQUIRED: 'Không được bỏ trống API Key',
    API_KEY_INVALID: 'API Key không hợp lệ',
    CHECKOUT_ORDER_SUCCESS: 'Xác thực thanh toán đơn hàng thành công',
    CHECKOUT_ORDER_FAILURE: 'Xác thực thanh toán đơn hàng thất bại',
    VOUCHER_IS_NOT_FOUND: 'Mã giảm giá không tồn tại',
    VOUCHER_REQUIREMENT_IS_NOT_MET: 'Mã giảm giá không đáp ứng yêu cầu',
    GET_ORDER_SUCCESS: 'Lấy danh sách đơn hàng thành công',
    GET_ORDER_FAILURE: 'Lấy danh sách đơn hàng thất bại',
    ORDER_ID_IS_REQUIRED: 'Không được bỏ trống id đơn hàng',
    ORDER_ID_MUST_BE_A_STRING: 'Id đơn hàng phải là 1 chuỗi kí tự',
    ORDER_ID_MUST_BE_A_ID: 'Id đơn hàng không đúng định dạng',
    ORDER_ID_DOES_NOT_EXIST: 'Id đơn hàng không tồn tại',
    DECISION_MUST_BE_A_BOOLEAN: 'Quyết định phải là một boolean',
    REASON_IS_REQUIRED: 'Không được bỏ trống lý do',
    REASON_MUST_BE_BETWEEN_5_AND_200_CHARACTERS: 'Lý do phải có độ dài từ 5 đến 200 kí tự',
    REASON_MUST_BE_A_STRING: 'lý do phải là một chuỗi kí tự',
    ORDER_APPROVED: 'Đơn hàng đã được duyệt',
    ORDER_NOT_APPROVED: 'Đơn hàng chưa được duyệt',
    ORDER_UNPAID: 'Đơn hàng chưa được thanh toán',
    ORDER_CANCELED: 'Đơn hàng đã bị hủy',
    ORDER_APPROVAL_SUCCESS: 'Kiểm duyệt đơn hàng thành công',
    ORDER_APPROVAL_FAILURE: 'Kiểm duyệt đơn hàng thất bại',
    CANCEL_ORDER_SUCCESS: 'Hủy đơn hàng thành công',
    CANCEL_ORDER_FAILURE: 'Hủy đơn hàng thất bại',
    RECEIVE_DELIVERY_SUCCESS: 'Giao hàng thành công',
    RECEIVE_DELIVERY_FAILURE: 'Giao hàng thất bại',
    PAYMENT_TYPE_IS_REQUIRED: 'Không được bỏ trống loại thanh toán',
    PAYMENT_TYPE_MUST_BE_A_NUMBER: 'Loại thanh toán phải là một số',
    PAYMENT_TYPE_IS_NOT_VALID: 'Loại thanh toán không đúng định dạng',
    PAYMENT_CONFIRMATION_SUCCESS: 'Xác nhận thanh toán thành công',
    PAYMENT_CONFIRMATION_FAILURE: 'Xác nhận thanh toán thất bại',
    ORDER_IS_NOT_OFFLINE_ORDER: 'Đơn hàng này không phải là đơn hàng tại quầy',
    ORDER_IS_NOT_ONLINE_ORDER: 'Đơn hàng này không phải là đơn hàng online',
    ORDER_COMPLETION_CONFIRMATION_SUCCESS: 'Xác nhận đơn hàng thành công',
    ORDER_COMPLETION_CONFIRMATION_FAILURE: 'Xác nhận đơn hàng thất bại',
    ORDER_NOT_DELIVERED: 'Đơn hàng chưa được giao',
    ORDER_DELIVERY_PERSON_MISMATCH: 'Bạn không phải là người giao đơn hàng này',
    CONFIRM_DELIVERY_COMPLETION_SUCCESS: 'Xác nhận giao đơn hàng thành công',
    CONFIRM_DELIVERY_COMPLETION_FAILURE: 'Xác nhận giao đơn hàng thất bại',
    ORDER_CAN_NOT_CANCEL: 'Không thể hủy đơn hàng'
  } as const

  static STATISTICAL_MESSAGE = {
    STATISTICAL_TIME_IS_REQUIRED: 'Không được bỏ trống thời gian thống kê',
    STATISTICAL_TIME_MUST_BE_A_NUMBER: 'Thời gian thống kê phải là một số',
    STATISTICAL_TIME_IS_NOT_VALID: 'Thời gian không đúng định dạng',
    STATISTICAL_SUCCESS: 'Lấy thông tin thống kê thành công',
    STATISTICAL_FAILURE: 'Lấy thông tin thống kê thất bại'
  } as const

  static ACCOUNT_MANAGEMENT_MESSAGE = {
    GET_ACCOUNT_SUCCESS: 'Lấy danh sách tài khoản thành công',
    GET_ACCOUNT_FAILURE: 'Lấy danh sách tài khoản thất bại',
    USER_ID_IS_REQUIRED: 'Không được bỏ trống id người dùng',
    USER_ID_MUST_BE_A_STRING: 'id người dùng phải là một chuỗi kí tự',
    USER_ID_IS_MUST_BE_A_ID: 'Id người dùng không đúng định dạng',
    USER_ID_DOES_NOT_EXIST: 'Id người dùng không tồn tại',
    BAN_USER_REASON_IS_REQUIRED: 'Không được bỏ trống lí do',
    BAN_USER_REASON_MUST_BE_A_STRING: 'Lí do phải là một chuỗi kí tự',
    BAN_USER_REASON_MUST_BE_FROM_1_TO_100: 'Lí do phải có độ dài từ 1 đến 100 ký tự',
    TIME_IS_REQUIRED: 'Không được bỏ trống thời gian ban',
    BAN_USER_TIME_MUST_BE_A_STRING: 'Thời gian ban người dùng phải là một chuỗi kí tự',
    TIME_DOES_NOT_EXIST: 'Thời gian không hợp lệ',
    BAN_ACCOUNT_SUCCESS: 'Khóa tài khoản thành công',
    BAN_ACCOUNT_FAILURE: 'Khóa tài khoản thất bại',
    UNBAN_ACCOUNT_SUCCESS: 'Mở khóa tài khoản thành công',
    UNBAN_ACCOUNT_FAILURE: 'Mở khóa tài khoản thất bại',
    ACCOUNT_HAS_BEEN_LOOKED: 'Tài khoản đã bị khóa',
    ACCOUNT_IS_NOT_LOOKED: 'Tài khoản này không bị khóa'
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
    EMAIL_NOT_FOUND: 'Email does not exist',
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
    VERIFY_TOKEN_FAILURE: 'Token verification failed',
    GET_USER_INFORMATION_SUCCESS: 'Get user information successful',
    GET_USER_INFORMATION_FAILURE: 'Get user information failed',
    SEND_EMAIL_VERIFY_SUCCESS: 'Account verification email sent successfully',
    SEND_EMAIL_VERIFY_FAILURE: 'Failed to send account verification email',
    ACCOUNT_IS_VERIFIED: 'Your account is verified',
    ACCOUNT_IS_NOT_VERIFIED: 'Your account is not verified',
    TOKEN_IS_REQUIRED: 'Token cannot be empty',
    TOKEN_MUST_BE_A_STRING: 'Token must be a string',
    TOKEN_INVALID: 'Invalid token',
    PASSWORD_CONFIRM_NOT_MATCH: 'Confirmation password must match the new password',
    VERIFY_ACCOUNT_SUCCESS: 'Account verification successful',
    VERIFY_ACCOUNT_FAILURE: 'Account verification failed',
    SEND_MAIL_FORGOT_PASSWORD_SUCCESS: 'Password reset request sent successfully',
    SEND_MAIL_FORGOT_PASSWORD_FAILURE: 'Failed to send password reset request',
    FORGOT_PASSWORD_SUCCESS: 'Password updated successfully',
    FORGOT_PASSWORD_FAILURE: 'Password update failed'
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
    KEYWORD_IS_REQUIRED: 'Search keyword is required',
    KEYWORD_MUST_BE_A_STRING: 'Search keyword must be a string'
  } as const

  static PRODUCT_MESSAGE = {
    PRODUCT_NAME_IS_REQUIRED: 'Product name is required',
    PRODUCT_NAME_MUST_BE_A_STRING: 'Product name must be a string',
    PRODUCT_NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Product name must be between 1 and 100 characters',
    PRODUCT_DESCRIPTION_IS_REQUIRED: 'Product description is required',
    PRODUCT_DESCRIPTION_MUST_BE_A_STRING: 'Product description must be a string',
    PRODUCT_DESCRIPTION_LENGTH_MUST_BE_FROM_1_TO_1000: 'Product description must be between 1 and 1000 characters',
    PRODUCT_PRICE_IS_REQUIRED: 'Product price is required',
    PRODUCT_PRICE_MUST_BE_A_NUMBER: 'Product price must be a number',
    PRODUCT_PRICE_MUST_BE_GREATER_THAN_0: 'Product price must be greater than 0',
    PRODUCT_AVAILABILITY_IS_REQUIRED: 'Product availability is required',
    PRODUCT_AVAILABILITY_MUST_BE_A_BOOLEAN: 'Product availability must be a boolean',
    PRODUCT_CATEGORY_IS_REQUIRED: 'Product category is required',
    PRODUCT_CATEGORY_MUST_BE_A_STRING: 'Product category must be a string',
    PRODUCT_CATEGORY_MUST_BE_A_ID: 'Product category is invalid',
    PRODUCT_CATEGORY_DOES_NOT_EXIST: 'Product category does not exist',
    PRODUCT_PREVIEW_IS_REQUIRED: 'Product preview image is required',
    CREATE_PRODUCT_SUCCESS: 'Product created successfully',
    CREATE_PRODUCT_FAILURE: 'Product creation failed',
    PRODUCT_ID_IS_REQUIRED: 'Product ID is required',
    PRODUCT_ID_MUST_BE_A_STRING: 'Product ID must be a string',
    PRODUCT_ID_MUST_BE_A_ID: 'Product ID is invalid',
    PRODUCT_DOES_NOT_EXIST: 'Product ID does not exist',
    UPDATE_PRODUCT_SUCCESS: 'Product updated successfully',
    UPDATE_PRODUCT_FAILURE: 'Product update failed',
    DELETE_PRODUCT_SUCCESS: 'Product deleted successfully',
    DELETE_PRODUCT_FAILURE: 'Product deletion failed',
    GET_PRODUCT_SUCCESS: 'Product information retrieved successfully',
    GET_PRODUCT_FAILURE: 'Product information retrieval failed',
    KEYWORD_IS_REQUIRED: 'Search keyword is required',
    KEYWORD_MUST_BE_A_STRING: 'Search keyword must be a string'
  } as const

  static VOUCHER_MESSAGE = {
    CODE_IS_REQUIRED: 'Voucher code is required',
    CODE_MUST_BE_A_STRING: 'Voucher code must be a string',
    CODE_LENGTH_MUST_BE_FROM_1_TO_50: 'Voucher code must be between 1 and 50 characters',
    CODE_ALREADY_EXISTS: 'Voucher code already exists',
    VOUCHER_QUANTITY_IS_REQUIRED: 'Voucher quantity is required',
    VOUCHER_QUANTITY_MUST_BE_A_NUMBER: 'Voucher quantity must be a number',
    PRODUCT_QUANTITY_MUST_BE_GREATER_THAN_0: 'Voucher quantity must be greater than 0',
    VOUCHER_DISCOUNT_IS_REQUIRED: 'Voucher discount is required',
    VOUCHER_DISCOUNT_MUST_BE_A_NUMBER: 'Voucher discount must be a number',
    PRODUCT_DISCOUNT_MUST_BE_GREATER_THAN_0: 'Voucher discount must be greater than 0',
    VOUCHER_REQUIREMENT_IS_REQUIRED: 'Voucher requirement is required',
    VOUCHER_REQUIREMENT_MUST_BE_A_NUMBER: 'Voucher requirement must be a number',
    PRODUCT_REQUIREMENT_MUST_BE_GREATER_THAN_0: 'Voucher requirement must be greater than 0',
    VOUCHER_EXPIRATION_IS_REQUIRED: 'Voucher expiration date is required',
    VOUCHER_EXPIRATION_IS_NOT_VALID: 'Voucher expiration date is invalid',
    PRODUCT_EXPIRATION_MUST_BE_GREATER_THAN_CURRENT_DATE:
      'Voucher expiration date must be greater than the current date',
    CREATE_VOUCHER_SUCCESS: 'Voucher created successfully',
    CREATE_VOUCHER_FAILURE: 'Voucher creation failed',
    VOUCHER_ID_REQUIRED: 'Voucher ID is required',
    VOUCHER_ID_MUST_BE_A_STRING: 'Voucher ID must be a string',
    VOUCHER_ID_MUST_BE_A_ID: 'Voucher ID is invalid',
    VOUCHER_DOES_NOT_EXIST: 'Voucher ID does not exist',
    UPDATE_VOUCHER_SUCCESS: 'Voucher updated successfully',
    UPDATE_VOUCHER_FAILURE: 'Voucher update failed',
    DELETE_VOUCHER_SUCCESS: 'Voucher deleted successfully',
    DELETE_VOUCHER_FAILURE: 'Voucher deletion failed',
    KEYWORD_IS_REQUIRED: 'Search keyword is required',
    KEYWORD_MUST_BE_A_STRING: 'Search keyword must be a string',
    GET_VOUCHER_SUCCESS: 'Voucher information retrieved successfully',
    GET_VOUCHER_FAILURE: 'Voucher information retrieval failed',
    CODE_MUST_BE_A_STRING_WITHOUT_SPECIAL_CHARACTERS:
      'Voucher code can only contain uppercase, lowercase, numbers, and underscores (_)'
  } as const

  static ORDER_MESSAGE = {
    ORDER_PRODUCT_IS_REQUIRED: 'Ordered product is required',
    ORDER_PRODUCT_MUST_BE_AN_ARRAY: 'Ordered product must be an array',
    ORDER_PRODUCT_QUANTITY_MUST_BE_A_NUMBER_GREATER_THAN_0: 'Ordered product quantity must be a number greater than 0',
    ORDER_PRODUCT_IS_NOT_FOUND: 'Ordered product not found',
    ORDER_PRODUCT_IS_NOT_AVAILABLE: 'Ordered product is out of stock',
    ORDER_NAME_IS_REQUIRED: 'Customer name is required',
    ORDER_NAME_MUST_BE_A_STRING: 'Customer name must be a string',
    ORDER_NAME_MUST_BE_BETWEEN_5_AND_100_CHARACTERS: 'Customer name must be between 5 and 100 characters',
    ORDER_EMAIL_IS_REQUIRED: 'Customer email is required',
    ORDER_EMAIL_MUST_BE_A_STRING: 'Customer email must be a string',
    ORDER_EMAIL_MUST_BE_BETWEEN_5_AND_100_CHARACTERS: 'Customer email must be between 5 and 100 characters',
    ORDER_EMAIL_IS_NOT_VALID: 'Customer email is not valid',
    ORDER_PHONE_IS_REQUIRED: 'Customer phone number is required',
    ORDER_PHONE_MUST_BE_A_STRING: 'Customer phone number must be a string',
    ORDER_PHONE_MUST_BE_BETWEEN_10_AND_11_CHARACTERS: 'Customer phone number must be between 10 and 11 digits',
    ORDER_PHONE_IS_NOT_VALID: 'Customer phone number is not valid',
    ORDER_LATITUDE_MUST_BE_A_NUMBER_BETWEEN_MINUS_90_AND_90: 'Latitude must be a number between -90 and 90',
    ORDER_LATITUDE_IS_REQUIRED: 'Latitude is required',
    ORDER_LONGITUDE_MUST_BE_A_NUMBER_BETWEEN_MINUS_180_AND_180: 'Longitude must be a number between -180 and 180',
    ORDER_LONGITUDE_IS_REQUIRED: 'Longitude is required',
    CREATE_ORDER_SUCCESS: 'Order created successfully',
    CREATE_ORDER_FAILURE: 'Order creation failed',
    API_KEY_REQUIRED: 'API Key is required',
    API_KEY_INVALID: 'Invalid API Key',
    CHECKOUT_ORDER_SUCCESS: 'Order checkout successful',
    CHECKOUT_ORDER_FAILURE: 'Order checkout failed',
    VOUCHER_IS_NOT_FOUND: 'Voucher not found',
    VOUCHER_REQUIREMENT_IS_NOT_MET: 'Voucher requirement not met',
    GET_ORDER_SUCCESS: 'Successfully retrieved order list',
    GET_ORDER_FAILURE: 'Failed to retrieve order list',
    ORDER_ID_IS_REQUIRED: 'Order ID cannot be empty',
    ORDER_ID_MUST_BE_A_STRING: 'Order ID must be a string',
    ORDER_ID_MUST_BE_A_ID: 'Order ID is not in the correct format',
    ORDER_ID_DOES_NOT_EXIST: 'Order ID does not exist',
    DECISION_MUST_BE_A_BOOLEAN: 'Decision must be a boolean',
    REASON_IS_REQUIRED: 'Reason cannot be empty',
    REASON_MUST_BE_BETWEEN_5_AND_200_CHARACTERS: 'Reason must be between 5 and 200 characters long',
    REASON_MUST_BE_A_STRING: 'The reason must be a string',
    ORDER_APPROVED: 'Order approved',
    ORDER_NOT_APPROVED: 'Order not approved',
    ORDER_CANCELED: 'Order canceled',
    ORDER_APPROVAL_SUCCESS: 'Order approval successful',
    ORDER_APPROVAL_FAILURE: 'Order approval failed',
    CANCEL_ORDER_SUCCESS: 'Order cancellation successful',
    CANCEL_ORDER_FAILURE: 'Order cancellation failed',
    RECEIVE_DELIVERY_SUCCESS: 'Delivery successful',
    RECEIVE_DELIVERY_FAILURE: 'Delivery failed',
    ORDER_UNPAID: 'unpaid order',
    PAYMENT_TYPE_IS_REQUIRED: 'Payment type cannot be empty',
    PAYMENT_TYPE_MUST_BE_A_NUMBER: 'Payment type must be a number',
    PAYMENT_TYPE_IS_NOT_VALID: 'Payment type is not in the correct format',
    PAYMENT_CONFIRMATION_SUCCESS: 'Payment confirmation successful',
    PAYMENT_CONFIRMATION_FAILURE: 'Payment confirmation failed',
    ORDER_IS_NOT_OFFLINE_ORDER: 'This order is not an offline order',
    ORDER_IS_NOT_ONLINE_ORDER: 'This order is not an online order',
    ORDER_COMPLETION_CONFIRMATION_SUCCESS: 'Order confirmation successful',
    ORDER_COMPLETION_CONFIRMATION_FAILURE: 'Order confirmation failed',
    ORDER_NOT_DELIVERED: 'Order delivered',
    ORDER_DELIVERY_PERSON_MISMATCH: 'You are not the delivery person for this order',
    CONFIRM_DELIVERY_COMPLETION_SUCCESS: 'Delivery completion confirmation successful',
    CONFIRM_DELIVERY_COMPLETION_FAILURE: 'Delivery completion confirmation failed',
    ORDER_CAN_NOT_CANCEL: 'Cannot cancel the order'
  } as const

  static STATISTICAL_MESSAGE = {
    STATISTICAL_TIME_IS_REQUIRED: 'Time cannot be empty',
    STATISTICAL_TIME_MUST_BE_A_NUMBER: 'Statistical time must be a number',
    STATISTICAL_TIME_IS_NOT_VALID: 'Invalid time format',
    STATISTICAL_SUCCESS: 'Statistical data retrieval successful',
    STATISTICAL_FAILURE: 'Statistical data retrieval failed'
  } as const

  static ACCOUNT_MANAGEMENT_MESSAGE = {
    GET_ACCOUNT_SUCCESS: 'Successfully retrieved account list',
    GET_ACCOUNT_FAILURE: 'Failed to retrieve account list',
    USER_ID_IS_REQUIRED: 'User ID cannot be empty',
    USER_ID_MUST_BE_A_STRING: 'User ID must be a string',
    USER_ID_IS_MUST_BE_A_ID: 'User ID is not in the correct format',
    USER_ID_DOES_NOT_EXIST: 'User ID does not exist',
    BAN_USER_REASON_IS_REQUIRED: 'Reason cannot be empty',
    BAN_USER_REASON_MUST_BE_A_STRING: 'Reason must be a string',
    BAN_USER_REASON_MUST_BE_FROM_1_TO_100: 'Reason must be between 1 and 100 characters long',
    TIME_IS_REQUIRED: 'Ban duration cannot be empty',
    BAN_USER_TIME_MUST_BE_A_STRING: 'Ban duration must be a string',
    TIME_DOES_NOT_EXIST: 'Invalid time',
    BAN_ACCOUNT_SUCCESS: 'Account successfully banned',
    BAN_ACCOUNT_FAILURE: 'Account ban failed',
    UNBAN_ACCOUNT_SUCCESS: 'Account successfully unbanned',
    UNBAN_ACCOUNT_FAILURE: 'Account unban failed',
    ACCOUNT_HAS_BEEN_LOCKED: 'The account has been locked',
    ACCOUNT_IS_NOT_LOCKED: 'This account is not locked'
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
  static GetUserInformationSuccessfully(user_id: string, ip: string) {
    return `Thực hiện lấy thông tin người dùng thành công (User: ${user_id}) (IP: ${ip})`
  }
  static GetUserInformationFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện lấy thông tin người dùng thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
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
  static GetCategorySuccessfully(ip: string) {
    return `Thực hiện lấy thông tin danh mục thành công (IP: ${ip})`
  }
  static GetCategoryFailed(ip: string, err: unknown) {
    return `Thực hiện lấy thông tin danh mục thất bại (IP: ${ip}) | Lỗi: ${err}`
  }
  static ProductCreateSuccessfully(user_id: string, ip: string) {
    return `Thực hiện tạo sản phẩm thành công (User: ${user_id}) (IP: ${ip})`
  }
  static ProductCreateFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện tạo sản phẩm thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static ProductUpdateSuccessfully(user_id: string, ip: string) {
    return `Thực hiện cập nhật sản phẩm thành công (User: ${user_id}) (IP: ${ip})`
  }
  static ProductUpdateFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện cập nhật sản phẩm thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static ProductDeleteSuccessfully(user_id: string, ip: string) {
    return `Thực hiện xóa sản phẩm thành công (User: ${user_id}) (IP: ${ip})`
  }
  static ProductDeleteFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện xóa sản phẩm thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static GetProductSuccessfully(ip: string) {
    return `Thực hiện lấy thông tin sản phẩm thành công (IP: ${ip})`
  }
  static GetProductFailed(ip: string, err: unknown) {
    return `Thực hiện lấy thông tin sản phẩm thất bại (IP: ${ip}) | Lỗi: ${err}`
  }
  static VoucherCreateSuccessfully(user_id: string, ip: string) {
    return `Thực hiện tạo mã giảm giá thành công (User: ${user_id}) (IP: ${ip})`
  }
  static VoucherCreateFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện tạo mã giảm giá thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static VoucherUpdateSuccessfully(user_id: string, ip: string) {
    return `Thực hiện cập nhật mã giảm giá thành công (User: ${user_id}) (IP: ${ip})`
  }
  static VoucherUpdateFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện cập nhật mã giảm giá thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static VoucherDeleteSuccessfully(user_id: string, ip: string) {
    return `Thực hiện xóa mã giảm giá thành công (User: ${user_id}) (IP: ${ip})`
  }
  static VoucherDeleteFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện xóa mã giảm giá thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static GetVoucherSuccessfully(user_id: string, ip: string) {
    return `Thực hiện lấy thông tin mã giảm giá thành công (User: ${user_id}) (IP: ${ip})`
  }
  static GetVoucherFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện lấy thông tin mã giảm giá thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static OrderOnlineSuccessfully(user_id: string, ip: string) {
    return `Thực hiện tạo đơn hàng thành công (User: ${user_id}) (IP: ${ip})`
  }
  static OrderOnlineFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện tạo đơn hàng thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static CheckoutOrderSuccessfully(ip: string) {
    return `Thực hiện xác nhận thanh toán đơn hàng thành công (IP: ${ip})`
  }
  static CheckoutOrderFailed(ip: string, err: unknown) {
    return `Thực hiện xác nhận đơn hàng thất bại (IP: ${ip}) | Lỗi: ${err}`
  }
  static GetOrderSuccessfully(user_id: string, ip: string) {
    return `Thực hiện lấy thông tin đơn hàng thành công (User: ${user_id}) (IP: ${ip})`
  }
  static GetOrderFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện lấy thông tin đơn hàng thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static OrderApprovalSuccessfully(user_id: string, ip: string) {
    return `Thực hiện kiểm duyệt đơn hàng thành công (User: ${user_id}) (IP: ${ip})`
  }
  static OrderApprovalFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện kiểm duyệt đơn hàng thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static CancelOrderSuccessfully(user_id: string, ip: string) {
    return `Thực hiện hủy đơn hàng thành công (User: ${user_id}) (IP: ${ip})`
  }
  static CancelOrderFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện hủy đơn hàng thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static ReceiveDeliverySuccessfully(user_id: string, ip: string) {
    return `Thực hiện nhận giao đơn hàng thành công (User: ${user_id}) (IP: ${ip})`
  }
  static ReceiveDeliveryFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện nhận giao đơn hàng thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static OrderOfflineSuccessfully(ip: string) {
    return `Thực hiện giao đơn hàng thành công (IP: ${ip})`
  }
  static OrderOfflineFailed(ip: string, err: unknown) {
    return `Thực hiện giao đơn hàng thất bại (IP: ${ip}) | Lỗi: ${err}`
  }
  static PaymentConfirmationSuccessfully(user_id: string, ip: string) {
    return `Thực hiện xác nhận thanh toán thành công (User: ${user_id}) (IP: ${ip})`
  }
  static PaymentConfirmationFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện xác nhận thanh toán thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static OrderCompletionConfirmationSuccessfully(user_id: string, ip: string) {
    return `Thực hiện xác nhận đơn hàng thành công (User: ${user_id}) (IP: ${ip})`
  }
  static OrderCompletionConfirmationFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện xác nhận đơn hàng thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static ConfirmDeliveryCompletionSuccessfully(user_id: string, ip: string) {
    return `Thực hiện xác nhận đã giao đơn hàng thành công (User: ${user_id}) (IP: ${ip})`
  }
  static ConfirmDeliveryCompletionFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện xác nhận đã giao đơn hàng thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static StatisticalOverviewSuccessful(user_id: string, ip: string) {
    return `Thực hiện lấy thông tin thống kê thành công (User: ${user_id}) (IP: ${ip})`
  }
  static StatisticalOverviewFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện lấy thông tin thống kê thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static AccountManagementSuccessfully(user_id: string, ip: string) {
    return `Thực hiện lấy danh sách tài khoản thành công (User: ${user_id}) (IP: ${ip})`
  }
  static AccountManagementFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện lấy danh sách tài khoản thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static BanAccountManagementSuccessfully(user_id: string, ip: string) {
    return `Thực hiện khóa khoản thành công (User: ${user_id}) (IP: ${ip})`
  }
  static BanAccountManagementFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện khóa tài khoản thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static UnBanAccountManagementSuccessfully(user_id: string, ip: string) {
    return `Thực hiện mở khóa khoản thành công (User: ${user_id}) (IP: ${ip})`
  }
  static UnBanAccountManagementFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện mở khóa tài khoản thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static BanAccount(display_name: string, reason: string, expires: Date) {
    return `Tài khoản ${display_name} đã bị khóa vì ${reason}, và sẽ hết hạn vào ${formatDateFull2(expires)}`
  }
  static SendEmailVerifySuccessfully(user_id: string, ip: string) {
    return `Thực hiện gửi email xác nhận tài khoản thành công (User: ${user_id}) (IP: ${ip})`
  }
  static SendEmailVerifyFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện gửi email xác nhận tài khoản thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static VerifyAccountSuccessfully(user_id: string, ip: string) {
    return `Thực hiện xác nhận tài khoản thành công (User: ${user_id}) (IP: ${ip})`
  }
  static VerifyAccountFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện xác nhận tài khoản thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static SendMailForgotPasswordSuccessfully(user_id: string, ip: string) {
    return `Thực hiện gửi yêu cầu đặt lại mật khẩu thành công (User: ${user_id}) (IP: ${ip})`
  }
  static SendMailForgotPasswordFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện gửi yêu cầu đặt mật khẩu thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
  }
  static ForgotPasswordSuccessfully(user_id: string, ip: string) {
    return `Thực hiện cập nhật mật khẩu thành công (User: ${user_id}) (IP: ${ip})`
  }
  static ForgotPasswordFailed(user_id: string, ip: string, err: unknown) {
    return `Thực hiện cập mật khẩu thất bại (User: ${user_id}) (IP: ${ip}) | Lỗi: ${err}`
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
  static GetUserInformationSuccessfully(user_id: string, ip: string) {
    return `User information retrieval successful (User: ${user_id}) (IP: ${ip})`
  }
  static GetUserInformationFailed(user_id: string, ip: string, err: unknown) {
    return `User information retrieval failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
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
  static GetCategorySuccessfully(ip: string) {
    return `Category information retrieval successful (IP: ${ip})`
  }
  static GetCategoryFailed(ip: string, err: unknown) {
    return `Category information retrieval failed (IP: ${ip}) | Error: ${err}`
  }
  static ProductCreateSuccessfully(user_id: string, ip: string) {
    return `Product creation successful (User: ${user_id}) (IP: ${ip})`
  }
  static ProductCreateFailed(user_id: string, ip: string, err: unknown) {
    return `Product creation failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static ProductUpdateSuccessfully(user_id: string, ip: string) {
    return `Product update successful (User: ${user_id}) (IP: ${ip})`
  }
  static ProductUpdateFailed(user_id: string, ip: string, err: unknown) {
    return `Product update failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static ProductDeleteSuccessfully(user_id: string, ip: string) {
    return `Product deletion successful (User: ${user_id}) (IP: ${ip})`
  }
  static ProductDeleteFailed(user_id: string, ip: string, err: unknown) {
    return `Product deletion failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static GetProductSuccessfully(ip: string) {
    return `Product information retrieval successful (IP: ${ip})`
  }
  static GetProductFailed(ip: string, err: unknown) {
    return `Product information retrieval failed (IP: ${ip}) | Error: ${err}`
  }
  static VoucherCreateSuccessfully(user_id: string, ip: string) {
    return `Voucher creation successful (User: ${user_id}) (IP: ${ip})`
  }
  static VoucherCreateFailed(user_id: string, ip: string, err: unknown) {
    return `Voucher creation failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static VoucherUpdateSuccessfully(user_id: string, ip: string) {
    return `Voucher update successful (User: ${user_id}) (IP: ${ip})`
  }
  static VoucherUpdateFailed(user_id: string, ip: string, err: unknown) {
    return `Voucher update failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static VoucherDeleteSuccessfully(user_id: string, ip: string) {
    return `Voucher deletion successful (User: ${user_id}) (IP: ${ip})`
  }
  static VoucherDeleteFailed(user_id: string, ip: string, err: unknown) {
    return `Voucher deletion failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static GetVoucherSuccessfully(user_id: string, ip: string) {
    return `Voucher information retrieval successful (User: ${user_id}) (IP: ${ip})`
  }
  static GetVoucherFailed(user_id: string, ip: string, err: unknown) {
    return `Voucher information retrieval failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static OrderOnlineSuccessfully(user_id: string, ip: string) {
    return `Order creation successful (User: ${user_id}) (IP: ${ip})`
  }
  static OrderOnlineFailed(user_id: string, ip: string, err: unknown) {
    return `Order creation failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static CheckoutOrderSuccessfully(ip: string) {
    return `Order checkout successful (IP: ${ip})`
  }
  static CheckoutOrderFailed(ip: string, err: unknown) {
    return `Order checkout failed (IP: ${ip}) | Error: ${err}`
  }
  static GetOrderSuccessfully(user_id: string, ip: string) {
    return `Order information retrieval successful (User: ${user_id}) (IP: ${ip})`
  }
  static GetOrderFailed(user_id: string, ip: string, err: unknown) {
    return `Order information retrieval failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static OrderApprovalSuccessfully(user_id: string, ip: string) {
    return `Order approval successful (User: ${user_id}) (IP: ${ip})`
  }
  static OrderApprovalFailed(user_id: string, ip: string, err: unknown) {
    return `Order approval failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static CancelOrderSuccessfully(user_id: string, ip: string) {
    return `Order cancellation successful (User: ${user_id}) (IP: ${ip})`
  }
  static CancelOrderFailed(user_id: string, ip: string, err: unknown) {
    return `Order cancellation failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static ReceiveDeliverySuccessfully(user_id: string, ip: string) {
    return `Order delivery successful (User: ${user_id}) (IP: ${ip})`
  }
  static ReceiveDeliveryFailed(user_id: string, ip: string, err: unknown) {
    return `Order delivery failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static OrderOfflineSuccessfully(ip: string) {
    return `Successfully processed offline order (IP: ${ip})`
  }
  static OrderOfflineFailed(ip: string, err: unknown) {
    return `Failed to process offline order (IP: ${ip}) | Error: ${err}`
  }
  static PaymentConfirmationSuccessfully(user_id: string, ip: string) {
    return `Successfully confirmed payment (User: ${user_id}) (IP: ${ip})`
  }
  static PaymentConfirmationFailed(user_id: string, ip: string, err: unknown) {
    return `Failed to confirm payment (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static OrderCompletionConfirmationSuccessfully(user_id: string, ip: string) {
    return `Order confirmation successful (User: ${user_id}) (IP: ${ip})`
  }
  static OrderCompletionConfirmationFailed(user_id: string, ip: string, err: unknown) {
    return `Order confirmation failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static ConfirmDeliveryCompletionSuccessfully(user_id: string, ip: string) {
    return `Delivery completion confirmation successful (User: ${user_id}) (IP: ${ip})`
  }
  static ConfirmDeliveryCompletionFailed(user_id: string, ip: string, err: unknown) {
    return `Delivery completion confirmation failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static StatisticalOverviewSuccessful(user_id: string, ip: string) {
    return `Statistical data retrieval successful (User: ${user_id}) (IP: ${ip})`
  }
  static StatisticalOverviewFailed(user_id: string, ip: string, err: unknown) {
    return `Statistical data retrieval failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static AccountManagementSuccessfully(user_id: string, ip: string) {
    return `Successfully retrieved account list (User: ${user_id}) (IP: ${ip})`
  }
  static AccountManagementFailed(user_id: string, ip: string, err: unknown) {
    return `Failed to retrieve account list (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static BanAccountManagementSuccessfully(user_id: string, ip: string) {
    return `Account ban successfully executed (User: ${user_id}) (IP: ${ip})`
  }
  static BanAccountManagementFailed(user_id: string, ip: string, err: unknown) {
    return `Account ban execution failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static UnBanAccountManagementSuccessfully(user_id: string, ip: string) {
    return `Account unban successfully executed (User: ${user_id}) (IP: ${ip})`
  }
  static UnBanAccountManagementFailed(user_id: string, ip: string, err: unknown) {
    return `Account unban execution failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static BanAccount(display_name: string, reason: string, expires: Date) {
    return `The account ${display_name} has been banned for ${reason} and will expire on ${formatDateFull2(expires)}`
  }
  static SendEmailVerifySuccessfully(user_id: string, ip: string) {
    return `Account verification email successfully sent (User: ${user_id}) (IP: ${ip})`
  }
  static SendEmailVerifyFailed(user_id: string, ip: string, err: unknown) {
    return `Failed to send account verification email (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static VerifyAccountSuccessfully(user_id: string, ip: string) {
    return `Successfully verified account (User: ${user_id}) (IP: ${ip})`
  }
  static VerifyAccountFailed(user_id: string, ip: string, err: unknown) {
    return `Failed to verify account (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static SendMailForgotPasswordSuccessfully(user_id: string, ip: string) {
    return `Password reset request sent successfully (User: ${user_id}) (IP: ${ip})`
  }
  static SendMailForgotPasswordFailed(user_id: string, ip: string, err: unknown) {
    return `Failed to send password reset request (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
  static ForgotPasswordSuccessfully(user_id: string, ip: string) {
    return `Password update successful (User: ${user_id}) (IP: ${ip})`
  }
  static ForgotPasswordFailed(user_id: string, ip: string, err: unknown) {
    return `Password update failed (User: ${user_id}) (IP: ${ip}) | Error: ${err}`
  }
}
