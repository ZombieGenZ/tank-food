import express from 'express'
import { createCategoryController, deleteCategoryController } from '~/controllers/categories.controllers'
import { authenticateValidator, authenticateAdministratorValidator } from '~/middlewares/authenticate.middlewares'
import { createCategoryValidator, deleteCategoryValidator } from '~/middlewares/categories.middlewares'
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

export default router
