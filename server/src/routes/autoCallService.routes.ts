// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

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
