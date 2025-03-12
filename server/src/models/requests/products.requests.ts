export interface CreateProductRequestsBody {
  language?: string
  title: string
  description: string
  price: number
  availability: boolean
  tag: string
  category_id: string
}
