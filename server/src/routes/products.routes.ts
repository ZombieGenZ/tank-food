// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import express from 'express'
import {
  createProductController,
  updateProductController,
  updateProductChangeImageController,
  deleteProductController,
  getProductController,
  getProductListController
} from '~/controllers/products.controllers'
import {
  authenticateUploadImageValidator,
  authenticateVerifyAccountUploadImageValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorUploadImageValidator
} from '~/middlewares/authenticate.middlewares'
import { languageUploadImageValidator, languageValidator } from '~/middlewares/language.middlewares'
import {
  setupProductImage,
  createProductValidator,
  updateProductValidator,
  updateProductChangeImageValidator,
  deleteProductValidator,
  discountValidator,
  getProductListValidator
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
 *    discount?: number,
 *    preview: file
 * }
 */
router.post(
  '/create',
  uploadProduct.single('preview'),
  languageUploadImageValidator,
  authenticateUploadImageValidator,
  authenticateVerifyAccountUploadImageValidator,
  authenticateAdministratorUploadImageValidator,
  setupProductImage,
  createProductValidator,
  discountValidator,
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
 *    tag?: string,
 *    discount?: number
 * }
 */
router.put(
  '/update',
  languageValidator,
  authenticateUploadImageValidator,
  authenticateVerifyAccountValidator,
  authenticateAdministratorUploadImageValidator,
  updateProductValidator,
  discountValidator,
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
 *    discount?: number,
 *    preview: file
 * }
 */
router.put(
  '/update-change-image',
  uploadProduct.single('preview'),
  languageUploadImageValidator,
  authenticateUploadImageValidator,
  authenticateVerifyAccountUploadImageValidator,
  authenticateAdministratorUploadImageValidator,
  setupProductImage,
  updateProductChangeImageValidator,
  discountValidator,
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
  languageValidator,
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
router.post(
  '/get-product',
  languageValidator,
  wrapRequestHandler(getProductController)
)

/*
 * Description: Lấy thông tin danh sách sản phẩm
 * Path: /api/products/get-product-list
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    product: [
 *      ...
 *      {
 *        product_id: string,
 *        quantity: number
 *      }
 *    ],
 * }
 */
router.post(
  '/get-product-list',
  languageValidator,
  getProductListValidator,
  wrapRequestHandler(getProductListController)
)

export default router
