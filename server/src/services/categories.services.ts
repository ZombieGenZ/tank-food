import {
  CreateCategoryRequestsBody,
  UpdateCategoryRequestsBody,
  DeleteCategoryRequestsBody,
  FindCategoryRequestsBody
} from '~/models/requests/categories.requests'
import databaseService from './database.services'
import Category from '~/models/schemas/categories.schemas'
import { translateContent } from '~/utils/ai.utils'
import { SplitTranslationString } from '~/utils/string.utils'
import { ObjectId } from 'mongodb'
import { notificationRealtime } from '~/utils/realtime.utils'

class CategoryService {
  async create(payload: CreateCategoryRequestsBody) {
    const translate = await translateContent(payload.category_name)
    const translateResult = SplitTranslationString(translate)

    const category_id = new ObjectId()
    const category = new Category({
      _id: category_id,
      category_name_translate_1: payload.category_name.trim(),
      translate_1_language: translateResult.language_1,
      category_name_translate_2: translateResult.translate_string.trim(),
      translate_2_language: translateResult.language_2,
      index: Number(payload.index)
    })

    console.log(category)

    await Promise.all([
      databaseService.categories.insertOne(category),
      notificationRealtime('freshSync', 'new-category', 'category/create', category)
    ])
  }

  async update(payload: UpdateCategoryRequestsBody) {
    const translate = await translateContent(payload.category_name)
    const translateResult = SplitTranslationString(translate)

    await databaseService.categories.updateOne(
      {
        _id: new ObjectId(payload.category_id)
      },
      {
        $set: {
          category_name_translate_1: payload.category_name.trim(),
          translate_1_language: translateResult.language_1,
          category_name_translate_2: translateResult.translate_string.trim(),
          translate_2_language: translateResult.language_2,
          index: Number(payload.index)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }

  async delete(payload: DeleteCategoryRequestsBody) {
    await Promise.all([
      databaseService.categories.deleteOne({
        _id: new ObjectId(payload.category_id)
      }),
      databaseService.products.updateMany(
        {
          category: new ObjectId(payload.category_id)
        },
        {
          $set: {
            category: null
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])
  }

  async getCategory() {
    const categories = await databaseService.categories.find({}).sort({ created_at: -1 }).toArray()
    return categories
  }

  async findCategory(payload: FindCategoryRequestsBody) {
    const categories = await databaseService.categories
      .find({ $text: { $search: payload.keywords } })
      .sort({ created_at: -1 })
      .toArray()
    return categories
  }

  async getCategoryShort() {
    const categories = await databaseService.categories
      .find({})
      .sort({ index: 1 })
      .project({ created_at: 0, updated_at: 0 })
      .toArray()
    return categories
  }
}

const categoryService = new CategoryService()
export default categoryService
