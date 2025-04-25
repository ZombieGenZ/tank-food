import express from 'express'
import { autoCallServiceHealthController } from '~/controllers/autoCallService.controllers'
const router = express.Router()

/*
 * Description: Kiểm tra phản hồi của máy chủ
 * Path: /api/auto-call-service/health
 * Method: GET
 */
router.get('/health', autoCallServiceHealthController)

export default router
