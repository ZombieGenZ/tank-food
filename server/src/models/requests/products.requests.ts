// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

export interface CreateProductRequestsBody {
  language?: string
  title: string
  description: string
  price: number
  availability: boolean
  tag: string
  category_id: string
  discount?: number
}

export interface UpdateProductRequestsBody {
  language?: string
  product_id: string
  title: string
  description: string
  price: number
  availability: boolean
  tag: string
  category_id: string
  discount?: number
}

export interface DeleteProductRequestsBody {
  language?: string
  product_id: string
}

export interface GetProductRequestsBody {
  language?: string
}
