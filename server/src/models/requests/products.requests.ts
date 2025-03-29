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
