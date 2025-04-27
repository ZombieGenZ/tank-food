// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { ObjectId } from 'mongodb'

interface CategoryType {
  _id?: ObjectId
  category_name_translate_1?: string
  translate_1_language?: string
  category_name_translate_2?: string
  translate_2_language?: string
  index: number
  created_by: ObjectId
  updated_by: ObjectId
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
  created_by: ObjectId
  updated_by: ObjectId
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
    this.created_by = category.created_by
    this.updated_by = category.updated_by
    this.created_at = category.created_at || date
    this.updated_at = category.updated_at || date
  }
}
