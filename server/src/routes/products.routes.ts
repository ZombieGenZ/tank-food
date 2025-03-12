import express from 'express'
import { createProductController } from '~/controllers/products.controllers'
import {
  authenticateAdministratorUploadImageValidator,
  authenticateUploadImageValidator
} from '~/middlewares/authenticate.middlewares'
import { createProductValidator, setupProductImage } from '~/middlewares/products.middlewares'
import { wrapRequestHandler } from '~/utils/handlers.utils'
import { uploadProduct } from '~/utils/image.utils'
const router = express.Router()

/*
 * Description: Tạo một sản phẩm mới
 * Path: /api/products/create
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    title: string,
 *    description: string,
 *    price: number,
 *    availability: boolean,
 *    category_id: string,
 *    tag?: string,
 *    preview: file
 * }
 */
router.post(
  '/create',
  uploadProduct.single('preview'),
  authenticateUploadImageValidator,
  authenticateAdministratorUploadImageValidator,
  setupProductImage,
  createProductValidator,
  wrapRequestHandler(createProductController)
)

export default router
