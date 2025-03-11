export interface CreateCategoryRequestsBody {
  language?: string
  category_name: string
  index: number
}

export interface DeleteCategoryRequestsBody {
  language?: string
  category_id: string
}
