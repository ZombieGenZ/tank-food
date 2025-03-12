import express from 'express'
import {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getCategoryController,
  findCategoryController,
  getCategoryShortController
} from '~/controllers/categories.controllers'
import { authenticateValidator, authenticateAdministratorValidator } from '~/middlewares/authenticate.middlewares'
import {
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  findCategoryValidator
} from '~/middlewares/categories.middlewares'
import { wrapRequestHandler } from '~/utils/handlers.utils'
const router = express.Router()

/*
 * Description: Thêm một danh mục mới vào CSDL
 * Path: /api/categories/create
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    category_name: string,
 *    index: number
 * }
 */
router.post(
  '/create',
  authenticateValidator,
  authenticateAdministratorValidator,
  createCategoryValidator,
  wrapRequestHandler(createCategoryController)
)

/*
 * Description: Cập nhật một danh mục đã có trên CSDL
 * Path: /api/categories/update
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    category_id: string,
 *    category_name: string,
 *    index: number
 * }
 */
router.put(
  '/update',
  authenticateValidator,
  authenticateAdministratorValidator,
  updateCategoryValidator,
  wrapRequestHandler(updateCategoryController)
)

/*
 * Description: Xóa một danh mục đã có trên CSDL
 * Path: /api/categories/delete
 * Method: DELETE
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    category_id: string
 * }
 */
router.delete(
  '/delete',
  authenticateValidator,
  authenticateAdministratorValidator,
  deleteCategoryValidator,
  wrapRequestHandler(deleteCategoryController)
)

/*
 * Description: Lấy danh sách danh mục đang có trên CSDL
 * Path: /api/categories/get-category
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string
 * }
 */
router.post(
  '/get-category',
  authenticateValidator,
  authenticateAdministratorValidator,
  wrapRequestHandler(getCategoryController)
)

/*
 * Description: Tìm kiếm danh sách danh mục đang có trên CSDL
 * Path: /api/categories/find-category
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string,
 *    keywords: string
 * }
 */
router.post(
  '/find-category',
  authenticateValidator,
  authenticateAdministratorValidator,
  findCategoryValidator,
  wrapRequestHandler(findCategoryController)
)

/*
 * Description: Lấy danh sách danh mục (Dạn rút gọn) có trên CSDL
 * Path: /api/categories/get-category-short
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    language?: string,
 *    refresh_token: string
 * }
 */
router.post(
  '/get-category-short',
  authenticateValidator,
  authenticateAdministratorValidator,
  wrapRequestHandler(getCategoryShortController)
)

export default router
