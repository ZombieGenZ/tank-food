import { ObjectId } from 'mongodb'

interface CategoryType {
  _id?: ObjectId
  category_name_translate_1?: string
  translate_1_language?: string
  category_name_translate_2?: string
  translate_2_language?: string
  index: number
  created_at?: Date
  updated_at?: Date
}

export default class Category {
  _id: ObjectId
  category_name_translate_1: string
  translate_1_language: string
  category_name_translate_2: string
  translate_2_language: string
  index: number
  created_at: Date
  updated_at: Date
  constructor(category: CategoryType) {
    const date = new Date()

    this._id = category._id || new ObjectId()
    this.category_name_translate_1 = category.category_name_translate_1 || ''
    this.translate_1_language = category.translate_1_language || ''
    this.category_name_translate_2 = category.category_name_translate_2 || ''
    this.translate_2_language = category.translate_2_language || ''
    this.index = category.index
    this.created_at = category.created_at || date
    this.updated_at = category.updated_at || date
  }
}
