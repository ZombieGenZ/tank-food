import { CreateCategoryRequestsBody } from '~/models/requests/categories.requests'
import databaseService from './database.services'
import Category from '~/models/schemas/categories.schemas'
import { translateContent } from '~/utils/ai.utils'
import { SplitTranslationString } from '~/utils/string.utils'

class CategoryService {
  async create(payload: CreateCategoryRequestsBody) {
    const translate = await translateContent(payload.category_name)
    const translateResult = SplitTranslationString(translate)

    await databaseService.categories.insertOne(
      new Category({
        category_name_translate_1: payload.category_name.trim(),
        translate_1_language: translateResult.language_1,
        category_name_translate_2: translateResult.translate_string.trim(),
        translate_2_language: translateResult.language_2,
        index: Number(payload.index)
      })
    )
  }
}

const categoryService = new CategoryService()
export default categoryService
