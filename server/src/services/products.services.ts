// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

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
import { notificationRealtime } from '~/utils/realtime.utils'
import User from '~/models/schemas/users.schemas'

class ProductService {
  async checkProductExist(product_id: string) {
    const product = await databaseService.order.findOne({ 'product.product_id': new ObjectId(product_id) })

    return !!product
  }
  async create(payload: CreateProductRequestsBody, image: ImageType, user: User) {
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

    const product_id = new ObjectId()
    const product = new Product({
      _id: product_id,
      title_translate_1: payload.title.trim(),
      title_translate_1_language: translateTitleResult.language_1,
      title_translate_2: translateTitleResult.translate_string.trim(),
      title_translate_2_language: translateTitleResult.language_2,
      description_translate_1: payload.description.trim(),
      description_translate_1_language: translateDescriptionResult.language_1,
      description_translate_2: translateDescriptionResult.translate_string.trim(),
      description_translate_2_language: translateDescriptionResult.language_2,
      price: Number(payload.price),
      availability: Boolean(payload.availability),
      category: new ObjectId(payload.category_id),
      tag_translate_1: !payload.tag ? '' : payload.tag.trim(),
      tag_translate_1_language: !translateTagResult ? '' : translateTagResult.language_1,
      tag_translate_2: !translateTagResult ? '' : translateTagResult.translate_string.trim(),
      tag_translate_2_language: !translateTagResult ? '' : translateTagResult.language_2,
      preview: image,
      discount: payload.discount ? Number(payload.discount) : 0,
      created_by: user._id,
      updated_by: user._id
    })

    await databaseService.products.insertOne(product);

    const products = await databaseService.products
      .aggregate([
        { $match: { _id: new ObjectId(product_id) } },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'category',
            foreignField: '_id',
            as: 'tempCategory'
          }
        },
        {
          $addFields: {
            categories: { $arrayElemAt: ['$tempCategory', 0] }
          }
        },
        {
          $project: {
            category: 0,
            tempCategory: 0
          }
        }
      ])
      .toArray()

    await notificationRealtime('freshSync', 'create-product', 'product/create', products);
  }
  async update(payload: UpdateProductRequestsBody, product: Product, user: User) {
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

    const product_id = new ObjectId(payload.product_id)

    await databaseService.products.updateOne(
      {
        _id: product_id
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
          price: Number(payload.price),
          availability: Boolean(payload.availability),
          category: new ObjectId(payload.category_id),
          tag_translate_1: !payload.tag ? '' : payload.tag.trim(),
          tag_translate_1_language: !translateTagResult ? '' : translateTagResult.language_1,
          tag_translate_2: !translateTagResult ? '' : translateTagResult.translate_string.trim(),
          tag_translate_2_language: !translateTagResult ? '' : translateTagResult.language_2,
          discount: payload.discount ? Number(payload.discount) : 0,
          updated_by: user._id
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    const products = await databaseService.products
    .aggregate([
      { $match: { _id: new ObjectId(product_id) } },
      {
        $lookup: {
          from: process.env.DATABASE_CATEGORY_COLLECTION as string,
          localField: 'category',
          foreignField: '_id',
          as: 'tempCategory'
        }
      },
      {
        $addFields: {
          categories: { $arrayElemAt: ['$tempCategory', 0] }
        }
      },
      {
        $project: {
          category: 0,
          tempCategory: 0
        }
      }
    ])
    .toArray()

    await notificationRealtime('freshSync', 'update-product', 'product/update', products)
  }
  async updateChangeImage(payload: UpdateProductRequestsBody, image: ImageType, product: Product, user: User) {
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

    const product_id = new ObjectId(payload.product_id)

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
          price: Number(payload.price),
          availability: Boolean(payload.availability),
          category: new ObjectId(payload.category_id),
          tag_translate_1: !payload.tag ? '' : payload.tag.trim(),
          tag_translate_1_language: !translateTagResult ? '' : translateTagResult.language_1,
          tag_translate_2: !translateTagResult ? '' : translateTagResult.translate_string.trim(),
          tag_translate_2_language: !translateTagResult ? '' : translateTagResult.language_2,
          preview: image,
          discount: payload.discount ? Number(payload.discount) : 0,
          updated_by: user._id
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    const products = await databaseService.products
    .aggregate([
      { $match: { _id: new ObjectId(payload.product_id) } },
      {
        $lookup: {
          from: process.env.DATABASE_CATEGORY_COLLECTION as string,
          localField: 'category',
          foreignField: '_id',
          as: 'tempCategory'
        }
      },
      {
        $addFields: {
          categories: { $arrayElemAt: ['$tempCategory', 0] }
        }
      },
      {
        $project: {
          category: 0,
          tempCategory: 0
        }
      }
    ])
    .toArray()

    await notificationRealtime('freshSync', 'update-product', 'product/update', products)
  }
  async delete(payload: DeleteProductRequestsBody, product: Product) {
    const data = {
      _id: new ObjectId(product._id)
    }

    await Promise.all([
      deleteCurrentFile(product.preview.path),
      databaseService.products.deleteOne({ _id: new ObjectId(payload.product_id) }),
      notificationRealtime('freshSync', 'delete-product', 'product/delete', data)
    ])
  }
  async getProduct() {
    const products = await databaseService.products
      .aggregate([
        { $sort: { created_at: -1 } },
        {
          $lookup: {
            from: process.env.DATABASE_CATEGORY_COLLECTION as string,
            localField: 'category',
            foreignField: '_id',
            as: 'tempCategory'
          }
        },
        {
          $addFields: {
            categories: { $arrayElemAt: ['$tempCategory', 0] }
          }
        },
        {
          $project: {
            category: 0,
            tempCategory: 0
          }
        }
      ])
      .toArray()

    return products
  }
}

const productService = new ProductService()
export default productService
