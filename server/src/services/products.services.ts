import {
  CreateProductRequestsBody,
  UpdateProductRequestsBody,
  DeleteProductRequestsBody
} from '~/models/requests/products.requests'
import { translateContent } from '~/utils/ai.utils'
import { SplitTranslationString } from '~/utils/string.utils'
import databaseService from './database.services'
import Product from '~/models/schemas/product.schemas'
import { ObjectId } from 'mongodb'
import { ImageType } from '~/constants/images.constants'
import { deleteCurrentFile } from '~/utils/image.utils'

class ProductService {
  async create(payload: CreateProductRequestsBody, image: ImageType) {
    let translateTagResult = null
    if (payload.tag) {
      const translateTag = await translateContent(payload.tag)

      translateTagResult = SplitTranslationString(translateTag)
    }

    const [translateTile, translateDescription] = await Promise.all([
      translateContent(payload.title),
      translateContent(payload.description)
    ])

    const translateTitleResult = SplitTranslationString(translateTile)
    const translateDescriptionResult = SplitTranslationString(translateDescription)

    await databaseService.products.insertOne(
      new Product({
        title_translate_1: payload.title.trim(),
        title_translate_1_language: translateTitleResult.language_1,
        title_translate_2: translateTitleResult.translate_string.trim(),
        title_translate_2_language: translateTitleResult.language_2,
        description_translate_1: payload.description.trim(),
        description_translate_1_language: translateDescriptionResult.language_1,
        description_translate_2: translateDescriptionResult.translate_string.trim(),
        description_translate_2_language: translateDescriptionResult.language_2,
        price: payload.price,
        availability: payload.availability,
        category: new ObjectId(payload.category_id),
        tag_translate_1: !payload.tag ? '' : payload.tag.trim(),
        tag_translate_1_language: !translateTagResult ? '' : translateTagResult.language_1,
        tag_translate_2: !translateTagResult ? '' : translateTagResult.translate_string.trim(),
        tag_translate_2_language: !translateTagResult ? '' : translateTagResult.language_2,
        preview: image
      })
    )
  }
  async update(payload: UpdateProductRequestsBody) {
    let translateTagResult = null
    if (payload.tag) {
      const translateTag = await translateContent(payload.tag)

      translateTagResult = SplitTranslationString(translateTag)
    }

    const [translateTile, translateDescription] = await Promise.all([
      translateContent(payload.title),
      translateContent(payload.description)
    ])

    const translateTitleResult = SplitTranslationString(translateTile)
    const translateDescriptionResult = SplitTranslationString(translateDescription)

    await databaseService.products.updateOne(
      {
        _id: new ObjectId(payload.product_id)
      },
      {
        $set: {
          title_translate_1: payload.title.trim(),
          title_translate_1_language: translateTitleResult.language_1,
          title_translate_2: translateTitleResult.translate_string.trim(),
          title_translate_2_language: translateTitleResult.language_2,
          description_translate_1: payload.description.trim(),
          description_translate_1_language: translateDescriptionResult.language_1,
          description_translate_2: translateDescriptionResult.translate_string.trim(),
          description_translate_2_language: translateDescriptionResult.language_2,
          price: payload.price,
          availability: payload.availability,
          category: new ObjectId(payload.category_id),
          tag_translate_1: !payload.tag ? '' : payload.tag.trim(),
          tag_translate_1_language: !translateTagResult ? '' : translateTagResult.language_1,
          tag_translate_2: !translateTagResult ? '' : translateTagResult.translate_string.trim(),
          tag_translate_2_language: !translateTagResult ? '' : translateTagResult.language_2
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }
  async updateChangeImage(payload: UpdateProductRequestsBody, image: ImageType) {
    let translateTagResult = null
    if (payload.tag) {
      const translateTag = await translateContent(payload.tag)

      translateTagResult = SplitTranslationString(translateTag)
    }

    const [translateTile, translateDescription] = await Promise.all([
      translateContent(payload.title),
      translateContent(payload.description)
    ])

    const translateTitleResult = SplitTranslationString(translateTile)
    const translateDescriptionResult = SplitTranslationString(translateDescription)

    await databaseService.products.updateOne(
      {
        _id: new ObjectId(payload.product_id)
      },
      {
        $set: {
          title_translate_1: payload.title.trim(),
          title_translate_1_language: translateTitleResult.language_1,
          title_translate_2: translateTitleResult.translate_string.trim(),
          title_translate_2_language: translateTitleResult.language_2,
          description_translate_1: payload.description.trim(),
          description_translate_1_language: translateDescriptionResult.language_1,
          description_translate_2: translateDescriptionResult.translate_string.trim(),
          description_translate_2_language: translateDescriptionResult.language_2,
          price: payload.price,
          availability: payload.availability,
          category: new ObjectId(payload.category_id),
          tag_translate_1: !payload.tag ? '' : payload.tag.trim(),
          tag_translate_1_language: !translateTagResult ? '' : translateTagResult.language_1,
          tag_translate_2: !translateTagResult ? '' : translateTagResult.translate_string.trim(),
          tag_translate_2_language: !translateTagResult ? '' : translateTagResult.language_2,
          preview: image
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
  }
  async delete(payload: DeleteProductRequestsBody, product: Product) {
    await Promise.all([
      deleteCurrentFile(product.preview.path),
      databaseService.products.deleteOne({ _id: new ObjectId(payload.product_id) })
    ])
  }
}

const productService = new ProductService()
export default productService
