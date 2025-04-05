import cron from 'node-cron'
import { backupPublicFolder } from './functions/backupUploadFile.functions'
import { autoUnBanAccountExpiredBanned } from './functions/autoUnBanAccountExpiredBanned.functions'
import { isLastDayOfMonth } from '~/utils/date.utils'
import { statisticalReport } from './functions/statisticalReport.functions'
import { autoExpiredVoucherPublic } from './functions/autoExpiredVoucherPublic.functions'

const runAllCrons = () => {
  // Cron job dùng để backup file mỗi ngày vào lúc 12h trưa và 0h đêm
  cron.schedule('0 0,12 * * *', backupPublicFolder)
  // Cron job dùng để tự động kiểm tra và tự động mở khóa tài khoản cho user khi đã hết thời gian bị cấm
  cron.schedule('* * * * *', autoUnBanAccountExpiredBanned)
  // Cron job dùng để tự động gửi thống kê hàng tháng cho quản trị viên
  cron.schedule('0 12 * * *', () => {
    if (isLastDayOfMonth()) {
      statisticalReport()
    }
  })
    // Cron job dùng để tự động kiểm tra và tự động vô hiệu hóa voucher khi đã hết thời gian sử dụng
    cron.schedule('* * * * *', autoExpiredVoucherPublic)
}

export default runAllCrons
