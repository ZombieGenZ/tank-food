import { ObjectId } from 'mongodb'
import { ImageType } from '~/constants/images.constants'

interface ProductType {
  _id?: ObjectId
  title_translate_1?: string
  title_translate_1_language?: string
  title_translate_2?: string
  title_translate_2_language?: string
  description_translate_1?: string
  description_translate_1_language?: string
  description_translate_2?: string
  description_translate_2_language?: string
  price: number
  availability?: boolean
  category?: ObjectId
  tag_translate_1?: string
  tag_translate_1_language?: string
  tag_translate_2?: string
  tag_translate_2_language?: string
  preview: ImageType
  discount?: number
  created_by: ObjectId
  updated_by: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id: ObjectId
  title_translate_1: string
  title_translate_1_language: string
  title_translate_2: string
  title_translate_2_language: string
  description_translate_1: string
  description_translate_1_language: string
  description_translate_2: string
  description_translate_2_language: string
  price: number
  availability: boolean
  category: ObjectId | null
  tag_translate_1: string
  tag_translate_1_language: string
  tag_translate_2: string
  tag_translate_2_language: string
  preview: ImageType
  discount: number
  created_by: ObjectId
  updated_by: ObjectId
  created_at: Date
  updated_at: Date

  constructor(product: ProductType) {
    const date = new Date()

    this._id = product._id || new ObjectId()
    this.title_translate_1 = product.title_translate_1 || ''
    this.title_translate_1_language = product.title_translate_1_language || ''
    this.title_translate_2 = product.title_translate_2 || ''
    this.title_translate_2_language = product.title_translate_2_language || ''
    this.description_translate_1 = product.description_translate_1 || ''
    this.description_translate_1_language = product.description_translate_1_language || ''
    this.description_translate_2 = product.description_translate_2 || ''
    this.description_translate_2_language = product.description_translate_2_language || ''
    this.price = product.price
    this.availability = product.availability || true
    this.category = product.category || null
    this.tag_translate_1 = product.tag_translate_1 || ''
    this.tag_translate_1_language = product.tag_translate_1_language || ''
    this.tag_translate_2 = product.tag_translate_2 || ''
    this.tag_translate_2_language = product.tag_translate_2_language || ''
    this.preview = product.preview
    this.discount = product.discount || 0
    this.created_by = product.created_by
    this.updated_by = product.updated_by
    this.created_at = product.created_at || date
    this.updated_at = product.updated_at || date
  }
}
