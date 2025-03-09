interface HttpStatusCodes {
  /** 100 Tiếp tục */
  CONTINUE: number
  /** 101 Đang chuyển giao giao thức */
  SWITCHING_PROTOCOLS: number
  /** 102 Đang xử lý */
  PROCESSING: number
  /** 200 Thành công */
  OK: number
  /** 201 Đã tạo */
  CREATED: number
  /** 202 Đã chấp nhận */
  ACCEPTED: number
  /** 203 Thông tin không chính thức */
  NON_AUTHORITATIVE_INFORMATION: number
  /** 204 Không có nội dung */
  NO_CONTENT: number
  /** 205 Đặt lại nội dung */
  RESET_CONTENT: number
  /** 206 Nội dung một phần */
  PARTIAL_CONTENT: number
  /** 207 Nhiều trạng thái */
  MULTI_STATUS: number
  /** 208 Đã báo cáo */
  ALREADY_REPORTED: number
  /** 226 Đã sử dụng */
  IM_USED: number
  /** 300 Nhiều lựa chọn */
  MULTIPLE_CHOICES: number
  /** 301 Di chuyển vĩnh viễn */
  MOVED_PERMANENTLY: number
  /** 302 Tìm thấy */
  FOUND: number
  /** 303 Xem khác */
  SEE_OTHER: number
  /** 304 Không được sửa đổi */
  NOT_MODIFIED: number
  /** 305 Sử dụng proxy */
  USE_PROXY: number
  /** 307 Chuyển hướng tạm thời */
  TEMPORARY_REDIRECT: number
  /** 308 Chuyển hướng vĩnh viễn */
  PERMANENT_REDIRECT: number
  /** 400 Yêu cầu không hợp lệ */
  BAD_REQUEST: number
  /** 401 Không được phép */
  UNAUTHORIZED: number
  /** 402 Cần thanh toán */
  PAYMENT_REQUIRED: number
  /** 403 Cấm */
  FORBIDDEN: number
  /** 404 Không tìm thấy */
  NOT_FOUND: number
  /** 405 Phương thức không được phép */
  METHOD_NOT_ALLOWED: number
  /** 406 Không chấp nhận được */
  NOT_ACCEPTABLE: number
  /** 407 Yêu cầu xác thực proxy */
  PROXY_AUTHENTICATION_REQUIRED: number
  /** 408 Yêu cầu hết thời gian */
  REQUEST_TIMEOUT: number
  /** 409 Xung đột */
  CONFLICT: number
  /** 410 Đã bị xóa */
  GONE: number
  /** 411 Yêu cầu độ dài */
  LENGTH_REQUIRED: number
  /** 412 Điều kiện trước không thành công */
  PRECONDITION_FAILED: number
  /** 413 Payload quá lớn */
  PAYLOAD_TOO_LARGE: number
  /** 414 URI quá dài */
  URI_TOO_LONG: number
  /** 415 Kiểu media không được hỗ trợ */
  UNSUPPORTED_MEDIA_TYPE: number
  /** 416 Khoảng không thỏa mãn */
  RANGE_NOT_SATISFIABLE: number
  /** 417 Kỳ vọng thất bại */
  EXPECTATION_FAILED: number
  /** 418 Tôi là một ấm trà */
  IM_A_TEAPOT: number
  /** 421 Yêu cầu chuyển hướng sai */
  MISDIRECTED_REQUEST: number
  /** 422 Thực thể không thể xử lý */
  UNPROCESSABLE_ENTITY: number
  /** 423 Đã khóa */
  LOCKED: number
  /** 424 Phụ thuộc thất bại */
  FAILED_DEPENDENCY: number
  /** 426 Yêu cầu nâng cấp */
  UPGRADE_REQUIRED: number
  /** 428 Yêu cầu điều kiện trước */
  PRECONDITION_REQUIRED: number
  /** 429 Quá nhiều yêu cầu */
  TOO_MANY_REQUESTS: number
  /** 431 Trường tiêu đề yêu cầu quá lớn */
  REQUEST_HEADER_FIELDS_TOO_LARGE: number
  /** 451 Không khả dụng vì lý do pháp lý */
  UNAVAILABLE_FOR_LEGAL_REASONS: number
  /** 499 Client đóng yêu cầu */
  CLIENT_CLOSED_REQUEST: number
  /** 500 Lỗi máy chủ nội bộ */
  INTERNAL_SERVER_ERROR: number
  /** 501 Chưa được triển khai */
  NOT_IMPLEMENTED: number
  /** 502 Cổng xấu */
  BAD_GATEWAY: number
  /** 503 Dịch vụ không khả dụng */
  SERVICE_UNAVAILABLE: number
  /** 504 Cổng hết thời gian */
  GATEWAY_TIMEOUT: number
  /** 505 Phiên bản HTTP không được hỗ trợ */
  HTTP_VERSION_NOT_SUPPORTED: number
  /** 506 Biến cũng đàm phán */
  VARIANT_ALSO_NEGOTIATES: number
  /** 507 Không đủ bộ nhớ */
  INSUFFICIENT_STORAGE: number
  /** 510 Không mở rộng */
  NOT_EXTENDED: number
  /** 511 Yêu cầu xác thực mạng */
  NETWORK_AUTHENTICATION_REQUIRED: number
}

const HTTPSTATUS: HttpStatusCodes = {
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTI_STATUS: 207,
  ALREADY_REPORTED: 208,
  IM_USED: 226,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  IM_A_TEAPOT: 418,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  NOT_EXTENDED: 510,
  NETWORK_AUTHENTICATION_REQUIRED: 511
} as const

export default HTTPSTATUS
