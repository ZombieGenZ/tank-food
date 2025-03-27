import express from 'express'
import {
  createProductController,
  updateProductController,
  updateProductChangeImageController,
  deleteProductController,
  getProductController
} from '~/controllers/products.controllers'
import {
  authenticateUploadImageValidator,
  authenticateVerifyAccountUploadImageValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorUploadImageValidator
} from '~/middlewares/authenticate.middlewares'
import {
  setupProductImage,
  createProductValidator,
  updateProductValidator,
  updateProductChangeImageValidator,
  deleteProductValidator
} from '~/middlewares/products.middlewares'
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
  authenticateVerifyAccountUploadImageValidator,
  authenticateAdministratorUploadImageValidator,
  setupProductImage,
  createProductValidator,
  wrapRequestHandler(createProductController)
)

/*
 * Description: Cập nhật sản phẩm (không sửa ảnh) trong CSDL
 * Path: /api/products/update
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    product_id: string,
 *    title: string,
 *    description: string,
 *    price: number,
 *    availability: boolean,
 *    category_id: string,
 *    tag?: string
 * }
 */
router.put(
  '/update',
  authenticateUploadImageValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorUploadImageValidator,
  updateProductValidator,
  wrapRequestHandler(updateProductController)
)

/*
 * Description: Cập nhật sản phẩm (Có sửa ảnh) trong CSDL
 * Path: /api/products/update-change-image
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    product_id: string,
 *    title: string,
 *    description: string,
 *    price: number,
 *    availability: boolean,
 *    category_id: string,
 *    tag?: string,
 *    preview: file
 * }
 */
router.put(
  '/update-change-image',
  uploadProduct.single('preview'),
  authenticateUploadImageValidator,
  authenticateVerifyAccountUploadImageValidator,
  authenticateAdministratorUploadImageValidator,
  setupProductImage,
  updateProductChangeImageValidator,
  wrapRequestHandler(updateProductChangeImageController)
)

/*
 * Description: Xóa sản phẩm khỏi CSDL
 * Path: /api/products/delete
 * Method: DELETE
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    product_id: string
 * }
 */
router.delete(
  '/delete',
  authenticateUploadImageValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorUploadImageValidator,
  deleteProductValidator,
  wrapRequestHandler(deleteProductController)
)

/*
 * Description: Lấy danh sách sản phẩm đang có trên CSDL
 * Path: /api/products/get-product
 * Method: POST
 * Body: {
 *    language?: string
 * }
 */
router.post('/get-product', wrapRequestHandler(getProductController))

export default router
