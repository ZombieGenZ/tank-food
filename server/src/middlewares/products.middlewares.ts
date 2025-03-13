import { Request, Response, NextFunction } from 'express'
import { checkSchema, validationResult } from 'express-validator'
import HTTPSTATUS from '~/constants/httpStatus.constants'
import { LANGUAGE } from '~/constants/language.constants'
import { ENGLISH_STATIC_MESSAGE, VIETNAMESE_STATIC_MESSAGE } from '~/constants/message.constants'
import { RESPONSE_CODE } from '~/constants/responseCode.constants'
import { writeWarnLog } from '~/utils/log.utils'
import { serverLanguage } from '~/index'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/users.schemas'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import { ImageType } from '~/constants/images.constants'
import { deleteCurrentFile, deleteTemporaryFile } from '~/utils/image.utils'
import { ParamsDictionary } from 'express-serve-static-core'

export const setupProductImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    const image = req.file as Express.Multer.File
    const language = req.body.language || serverLanguage

    if (!image) {
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.INPUT_DATA_ERROR,
        message:
          language == LANGUAGE.VIETNAMESE
            ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PREVIEW_IS_REQUIRED
            : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PREVIEW_IS_REQUIRED
      })
      return
    }

    if (req.body.product_id) {
      const product = await databaseService.products.findOne({
        _id: new ObjectId(req.body.product_id)
      })

      if (product) {
        await deleteCurrentFile(product.preview.path)
      }
    }

    const directoryPath = path.join(__dirname, `../../../client/public/images/upload/products/${user._id}`)

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true })
    }

    try {
      fs.renameSync(image.path, path.join(directoryPath, image.filename))
    } catch (err) {
      return next(err)
    }

    const watermarkImagePath = path.join(__dirname, '../../../client/public/images/system/watermark.png')
    const imgPath = path.join(directoryPath, image.filename)

    const metadata = await sharp(imgPath).metadata()

    const watermarkMetadata = await sharp(watermarkImagePath).metadata()

    if (!metadata.width || !metadata.height || !watermarkMetadata.width || !watermarkMetadata.height) {
      throw new Error('Could not get image dimensions')
    }

    const x = metadata.width - watermarkMetadata.width - 30
    const y = metadata.height - watermarkMetadata.height - 30

    const buffer = await sharp(imgPath)
      .composite([
        {
          input: watermarkImagePath,
          left: x,
          top: y
        }
      ])
      .toBuffer()

    await sharp(buffer).toFile(imgPath + '_temp')
    fs.unlinkSync(imgPath)
    fs.renameSync(imgPath + '_temp', imgPath)

    const img: ImageType = {
      path: `../../../client/public/images/upload/products/${user._id}/${image.filename}`,
      type: image.mimetype,
      url: `${process.env.IMAGE_URL}/images/upload/products/${user._id}/${image.filename}`,
      size: image.size
    }

    req.image = img
    next()
  } catch (error) {
    await deleteTemporaryFile(req.file)
    console.error('Lỗi khi xử lý hình ảnh:', error)
    next(error)
  }
}

export const createProductValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      title: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_LENGTH_MUST_BE_FROM_1_TO_100
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_LENGTH_MUST_BE_FROM_1_TO_100
        }
      },
      description: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 1000
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_LENGTH_MUST_BE_FROM_1_TO_1000
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_LENGTH_MUST_BE_FROM_1_TO_1000
        }
      },
      price: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_IS_REQUIRED
        },
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_MUST_BE_GREATER_THAN_0
                  : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_MUST_BE_GREATER_THAN_0
              )
            }

            return true
          }
        }
      },
      availability: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_AVAILABILITY_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_AVAILABILITY_IS_REQUIRED
        },
        isBoolean: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_AVAILABILITY_MUST_BE_A_BOOLEAN
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_AVAILABILITY_MUST_BE_A_BOOLEAN
        }
      },
      category_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_MUST_BE_A_ID
        },
        custom: {
          options: async (value) => {
            const category = await databaseService.categories.findOne({ _id: new ObjectId(value) })

            if (!category) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_DOES_NOT_EXIST
              )
            }

            return true
          }
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(async () => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        await deleteTemporaryFile(req.file)
        if (language == LANGUAGE.VIETNAMESE) {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: VIETNAMESE_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        } else {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: ENGLISH_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        }
      }
      next()
      return
    })
    .catch(async (err) => {
      await Promise.all([
        deleteTemporaryFile(req.file),
        writeWarnLog(typeof err === 'string' ? err : err instanceof Error ? err.message : String(err))
      ])
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.FATAL_INPUT_ERROR,
        message: err
      })
      return
    })
}

export const updateProductValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      product_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_MUST_BE_A_ID
        },
        custom: {
          options: async (value) => {
            const product = await databaseService.products.findOne({ _id: new ObjectId(value) })

            if (!product) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DOES_NOT_EXIST
              )
            }

            ;(req as Request).product = product

            return true
          }
        }
      },
      title: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_LENGTH_MUST_BE_FROM_1_TO_100
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_LENGTH_MUST_BE_FROM_1_TO_100
        }
      },
      description: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 1000
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_LENGTH_MUST_BE_FROM_1_TO_1000
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_LENGTH_MUST_BE_FROM_1_TO_1000
        }
      },
      price: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_IS_REQUIRED
        },
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_MUST_BE_GREATER_THAN_0
                  : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_MUST_BE_GREATER_THAN_0
              )
            }

            return true
          }
        }
      },
      availability: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_AVAILABILITY_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_AVAILABILITY_IS_REQUIRED
        },
        isBoolean: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_AVAILABILITY_MUST_BE_A_BOOLEAN
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_AVAILABILITY_MUST_BE_A_BOOLEAN
        }
      },
      category_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_MUST_BE_A_ID
        },
        custom: {
          options: async (value) => {
            const category = await databaseService.categories.findOne({ _id: new ObjectId(value) })

            if (!category) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_DOES_NOT_EXIST
              )
            }

            return true
          }
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        if (language == LANGUAGE.VIETNAMESE) {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: VIETNAMESE_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        } else {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: ENGLISH_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        }
      }
      next()
      return
    })
    .catch((err) => {
      writeWarnLog(typeof err === 'string' ? err : err instanceof Error ? err.message : String(err))
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.FATAL_INPUT_ERROR,
        message: err
      })
      return
    })
}

export const updateProductChangeImageValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      product_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_MUST_BE_A_ID
        },
        custom: {
          options: async (value) => {
            const product = await databaseService.products.findOne({ _id: new ObjectId(value) })

            if (!product) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DOES_NOT_EXIST
              )
            }

            ;(req as Request).product = product

            return true
          }
        }
      },
      title: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_LENGTH_MUST_BE_FROM_1_TO_100
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_NAME_LENGTH_MUST_BE_FROM_1_TO_100
        }
      },
      description: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 1000
          },
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_LENGTH_MUST_BE_FROM_1_TO_1000
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_LENGTH_MUST_BE_FROM_1_TO_1000
        }
      },
      price: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_IS_REQUIRED
        },
        isInt: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_MUST_BE_A_NUMBER
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_MUST_BE_GREATER_THAN_0
                  : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_PRICE_MUST_BE_GREATER_THAN_0
              )
            }

            return true
          }
        }
      },
      availability: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_AVAILABILITY_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_AVAILABILITY_IS_REQUIRED
        },
        isBoolean: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_AVAILABILITY_MUST_BE_A_BOOLEAN
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_AVAILABILITY_MUST_BE_A_BOOLEAN
        }
      },
      category_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_MUST_BE_A_ID
        },
        custom: {
          options: async (value) => {
            const category = await databaseService.categories.findOne({ _id: new ObjectId(value) })

            if (!category) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_CATEGORY_DOES_NOT_EXIST
              )
            }

            return true
          }
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(async () => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        await deleteTemporaryFile(req.file)
        if (language == LANGUAGE.VIETNAMESE) {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: VIETNAMESE_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        } else {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: ENGLISH_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        }
      }
      next()
      return
    })
    .catch(async (err) => {
      await Promise.all([
        deleteTemporaryFile(req.file),
        writeWarnLog(typeof err === 'string' ? err : err instanceof Error ? err.message : String(err))
      ])
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.FATAL_INPUT_ERROR,
        message: err
      })
      return
    })
}

export const deleteProductValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      product_id: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_IS_REQUIRED
        },
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_MUST_BE_A_STRING
        },
        isMongoId: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_MUST_BE_A_ID
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_ID_MUST_BE_A_ID
        },
        custom: {
          options: async (value) => {
            const product = await databaseService.products.findOne({ _id: new ObjectId(value) })

            if (!product) {
              throw new Error(
                language == LANGUAGE.VIETNAMESE
                  ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DOES_NOT_EXIST
                  : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.PRODUCT_DOES_NOT_EXIST
              )
            }

            ;(req as Request).product = product

            return true
          }
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        if (language == LANGUAGE.VIETNAMESE) {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: VIETNAMESE_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        } else {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: ENGLISH_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        }
      }
      next()
      return
    })
    .catch((err) => {
      writeWarnLog(typeof err === 'string' ? err : err instanceof Error ? err.message : String(err))
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.FATAL_INPUT_ERROR,
        message: err
      })
      return
    })
}

export const findProductValidator = async (req: Request, res: Response, next: NextFunction) => {
  const language = req.body.language || serverLanguage

  checkSchema(
    {
      keywords: {
        notEmpty: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.KEYWORD_IS_REQUIRED
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.KEYWORD_IS_REQUIRED
        },
        trim: true,
        isString: {
          errorMessage:
            language == LANGUAGE.VIETNAMESE
              ? VIETNAMESE_STATIC_MESSAGE.PRODUCT_MESSAGE.KEYWORD_MUST_BE_A_STRING
              : ENGLISH_STATIC_MESSAGE.PRODUCT_MESSAGE.KEYWORD_MUST_BE_A_STRING
        }
      }
    },
    ['body']
  )
    .run(req)
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        if (language == LANGUAGE.VIETNAMESE) {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: VIETNAMESE_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        } else {
          res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
            code: RESPONSE_CODE.INPUT_DATA_ERROR,
            message: ENGLISH_STATIC_MESSAGE.SYSTEM_MESSAGE.VALIDATION_ERROR,
            errors: errors.mapped()
          })
          return
        }
      }
      next()
      return
    })
    .catch((err) => {
      writeWarnLog(typeof err === 'string' ? err : err instanceof Error ? err.message : String(err))
      res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
        code: RESPONSE_CODE.FATAL_INPUT_ERROR,
        message: err
      })
      return
    })
}
