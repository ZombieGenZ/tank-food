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
import User from '~/models/schemas/users.schemas'

class CategoryService {
  async create(payload: CreateCategoryRequestsBody, user: User) {
    const translate = await translateContent(payload.category_name)
    const translateResult = SplitTranslationString(translate)

    const category_id = new ObjectId()
    const category = new Category({
      _id: category_id,
      category_name_translate_1: payload.category_name.trim(),
      translate_1_language: translateResult.language_1,
      category_name_translate_2: translateResult.translate_string.trim(),
      translate_2_language: translateResult.language_2,
      created_by: user._id,
      updated_by: user._id,
      index: Number(payload.index)
    })

    await Promise.all([
      databaseService.categories.insertOne(category),
      notificationRealtime('freshSync', 'create-category', 'category/create', category)
    ])
  }

  async update(payload: UpdateCategoryRequestsBody, user: User) {
    const translate = await translateContent(payload.category_name)
    const translateResult = SplitTranslationString(translate)

    const category_id = new ObjectId(payload.category_id)

    const category = {
      _id: category_id,
      category_name_translate_1: payload.category_name.trim(),
      translate_1_language: translateResult.language_1,
      category_name_translate_2: translateResult.translate_string.trim(),
      translate_2_language: translateResult.language_2,
      updated_by: user._id,
      index: Number(payload.index)
    }

    await Promise.all([
      databaseService.categories.updateOne(
        {
          _id: category_id
        },
        {
          $set: {
            category_name_translate_1: payload.category_name.trim(),
            translate_1_language: translateResult.language_1,
            category_name_translate_2: translateResult.translate_string.trim(),
            translate_2_language: translateResult.language_2,
            updated_by: user._id,
            index: Number(payload.index)
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      notificationRealtime('freshSync', 'delete-category', 'category/update', category)
    ])
  }

  async delete(payload: DeleteCategoryRequestsBody) {
    const category_id = new ObjectId(payload.category_id)

    const data = {
      _id: category_id
    }

    await Promise.all([
      databaseService.categories.deleteOne({
        _id: category_id
      }),
      databaseService.products.updateMany(
        {
          category: category_id
        },
        {
          $set: {
            category: null
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      notificationRealtime('freshSync', 'delete-category', 'category/delete', data)
    ])
  }

  async getCategory() {
    const categories = await databaseService.categories.find({}).sort({ index: 1 }).toArray()
    return categories
  }

  async findCategory(payload: FindCategoryRequestsBody) {
    const categories = await databaseService.categories
      .find({ $text: { $search: payload.keywords } })
      .sort({ index: -1 })
      .toArray()
    return categories
  }
}

const categoryService = new CategoryService()
export default categoryService
