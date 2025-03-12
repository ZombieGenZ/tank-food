export interface CreateProductRequestsBody {
  language?: string
  title: string
  description: string
  price: number
  availability: boolean
  category_id: string
}
