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
  preview: ImageType
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
  preview: ImageType
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
    this.preview = product.preview
    this.created_at = product.created_at || date
    this.updated_at = product.updated_at || date
  }
}
