import express from 'express'
import { createCategoryController } from '~/controllers/categories.controllers'
import { authenticateValidator, authenticateAdministratorValidator } from '~/middlewares/authenticate.middlewares'
import { createCategoryValidator } from '~/middlewares/categories.middlewares'
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

export default router
