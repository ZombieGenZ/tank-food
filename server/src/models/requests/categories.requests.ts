// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

export interface CreateCategoryRequestsBody {
  language?: string
  category_name: string
  index: number
}

export interface UpdateCategoryRequestsBody {
  language?: string
  category_id: string
  category_name: string
  index: number
}

export interface DeleteCategoryRequestsBody {
  language?: string
  category_id: string
}

export interface GetCategoryRequestsBody {
  language?: string
}
