// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import bodyParser from 'body-parser'
import databaseService from './services/database.services'
import { startBot, stopBot } from './utils/discord.utils'
import { writeInfoLog } from './utils/log.utils'
import { formatDateFull2 } from './utils/date.utils'
import { LANGUAGE } from './constants/language.constants'
import { ObjectId } from 'mongodb'
import { verifyToken } from './utils/jwt.utils'
import { TokenPayload } from './models/requests/authentication.requests'
import { defaultErrorHandler, notFoundHandler } from './middlewares/errors.middlewares'
import { UserRoleEnum } from './constants/users.constants'
import expressUserAgent from 'express-useragent'
import runAllCrons from './jobs/global.jobs'

dotenv.config()
const port = process.env.APP_PORT || 3000

const app = express()
const server = createServer(app)
const serverRunningTime = new Date()
const serverLanguage = process.env.APP_LANGUAGE as string
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  maxHttpBufferSize: 10e7,
  allowEIO3: true
})

databaseService.connect()

// realtime middleware
app.use((req, res, next) => {
  ;(req as any).io = io
  next()
})

app.use(express.json())
app.use(expressUserAgent.express())
app.use(express.static(path.join(__dirname, '../public')))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('trust proxy', true)

// import api router
import api_users from '~/routes/users.routes'
import api_categories from '~/routes/categories.routes'
import api_products from '~/routes/products.routes'
import api_voucher_public from '~/routes/voucherPublic.routes'
import api_voucher_private from '~/routes/voucherPrivate.routes'
import api_order from '~/routes/orders.routes'
import api_statistical from '~/routes/statistical.routes'
import api_account_management from '~/routes/accountManagement.routes'
import api_contact from '~/routes/contact.routes'
import api_notification from '~/routes/notification.routes'
import api_auto_call_service from '~/routes/autoCallService.routes'

app.use('/api/users', api_users)
app.use('/api/categories', api_categories)
app.use('/api/products', api_products)
app.use('/api/voucher-public', api_voucher_public)
app.use('/api/voucher-private', api_voucher_private)
app.use('/api/orders', api_order)
app.use('/api/statistical', api_statistical)
app.use('/api/account-management', api_account_management)
app.use('/api/contact', api_contact)
app.use('/api/notification', api_notification)
app.use('/api/auto-call-service', api_auto_call_service)

app.use(notFoundHandler);

app.use(defaultErrorHandler)

// realtime logic
io.on('connection', (socket: Socket) => {
  if (serverLanguage == LANGUAGE.VIETNAMESE) {
    console.log(
      `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến máy chủ \x1b[36m${process.env.TRADEMARK_NAME} ${port}.\x1b[0m`
    )
  } else {
    console.log(
      `\x1b[33mUser \x1b[36m${socket.id}\x1b[33m has connected to the \x1b[36m${process.env.TRADEMARK_NAME} ${port} server.\x1b[0m`
    )
  }

  socket.on('connect-guest-realtime', async () => {
    // Phòng: freshSync
    // sự kiện:
    // create-category: Cập nhật thông tin danh mục vừa được thêm vào CSDL
    // update-category: Cập nhật thông tin danh mục vừa được cập nhật vào CSDL
    // delete-category: Cập nhật thông tin danh mục vừa được xóa khỏi CSDL
    // create-product: Cập nhật thông tin sản phẩm vừa được thêm vào CSDL
    // update-product: Cập nhật thông tin sản phẩm vừa được cập nhật vào CSDL
    // delete-product: Cập nhật thông tin sản phẩm vừa được xóa khỏi CSDL
    // create-public-voucher: Cập nhật thông tin voucher (công khai) vừa được tạo
    // update-public-voucher: Cập nhật thông tin voucher (công khai) vừa được chỉnh sửa
    // delete-public-voucher: Cập nhật thông tin voucher (công khai) vừa được xóa
    // expired-public-voucher: Cập nhật thông tin voucher (công khai) vừa bị hết hạn
    //

    socket.join(`freshSync`)
    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      console.log(`\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36mfreshSync\x1b[0m`)
    } else {
      console.log(`\x1b[33mUser \x1b[36m${socket.id}\x1b[33m has connected to the room \x1b[36mfreshSync\x1b[0m`)
    }
  })

  socket.on('connect-user-realtime', async (refresh_token: string) => {
    // Phòng: freshSync-user-<user_id>
    // sự kiện:
    // new-voucher-private: Cập nhật thông tin voucher private vừa được thêm
    // use-voucher-private: Cập nhật thông tin voucher private vừa được sử dụng
    // create-order-booking: Cập nhật thông tin đặt hàng vừa được đặt
    // checkout-order-booking: Cập nhật thông tin đặt hàng vừa được thanh toán
    // approval-order-booking: Cập nhật thông tin đặt hàng vừa được xử lý
    // cancel-order-booking: Cập nhật thông tin đặt hàng vừa bị hủy
    // complete-order-booking: Cập nhật thông tin đặt hàng vừa được hoàn thành
    // delivery-order: Cập nhật thông tin đặt hàng vừa được nhận giao hàng
    // cancel-delivery: Cập nhật thông tin đặt hàng vừa bị hủy giao hàng
    // ban: Cập nhật thông tin khóa tài khoản
    // unBan: Cập nhật thông tin mở tài khoản
    // verify-account: Cập nhật thông tin xác minh tài khoản
    // logout: Cập nhật thông tin đang xuất tài khoản
    // new-notification: Cập nhật thông tin thông báo mới
    // create-public-voucher-storage: Cập nhật thông tin voucher (công khai) vừa được thêm vào CSDL
    // update-public-voucher-storage: Cập nhật thông tin voucher (công khai) vừa được cập nhật vào CSDL
    // delete-public-voucher-storage: Cập nhật thông tin voucher (công khai) vừa được xóa khỏi CSDL
    // expired-public-voucher-storage: Cập nhật thông tin voucher (công khai) vừa bị hết hạn
    //

    if (!refresh_token) {
      return
    }

    try {
      const decoded_refresh_token = (await verifyToken({
        token: refresh_token,
        publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
      })) as TokenPayload

      if (!decoded_refresh_token) {
        return
      }

      const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_refresh_token.user_id) })

      if (!user) {
        return
      }

      socket.join(`freshSync-user-${user._id}`)
      if (serverLanguage == LANGUAGE.VIETNAMESE) {
        console.log(
          `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36mfreshSync-user-${user._id}\x1b[0m`
        )
      } else {
        console.log(
          `\x1b[33mUser \x1b[36m${socket.id}\x1b[33m connected to room \x1b[36mfreshSync-user-${user._id}\x1b[0m`
        )
      }
    } catch {
      return
    }
  })

  socket.on('connect-employee-realtime', async (refresh_token: string) => {
    // Phòng: freshSync-employee
    // sự kiện:
    // create-order: Cập nhật thông tin đặt hàng vừa được đặt
    // checkout-order: Cập nhật thông tin đặt hàng vừa được thanh toán
    // approval-order: Cập nhật thông tin đặt hàng vừa được kiểm duyệt
    // cancel-order: Cập nhật thông tin đặt hàng vừa bị hủy
    // complete-order: Cập nhật thông tin đặt hàng vừa được hoàn thành
    // payment-confirmation: Cập nhật thông tin đơn đặt hàng đã được xác nhận thanh toán
    //

    if (!refresh_token) {
      return
    }

    try {
      const decoded_refresh_token = (await verifyToken({
        token: refresh_token,
        publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
      })) as TokenPayload

      if (!decoded_refresh_token) {
        return
      }

      const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_refresh_token.user_id) })

      if (!user) {
        return
      }

      if (user.role !== UserRoleEnum.ADMINISTRATOR && user.role !== UserRoleEnum.EMPLOYEE) {
        return
      }

      socket.join('freshSync-employee')
      if (serverLanguage == LANGUAGE.VIETNAMESE) {
        console.log(
          `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36mfreshSync-employee\x1b[0m`
        )
      } else {
        console.log(`\x1b[33mUser \x1b[36m${socket.id}\x1b[33m connected to room \x1b[36mfreshSync-employee\x1b[0m`)
      }
    } catch {
      return
    }
  })

  socket.on('connect-shipper-realtime', async (refresh_token: string) => {
    // Phòng: freshSync-shipper
    // sự kiện:
    // create-delivery: Cập nhật thông tin đặt hàng vừa xác nhận
    // remove-delivery: Cập nhật thông tin đặt hàng vừa xác nhận
    //
    // Phòng: freshSync-shipper-<user_id>
    // cancel-delivery: Cập nhật thông tin đặt hàng vừa bị hủy
    //

    if (!refresh_token) {
      return
    }

    try {
      const decoded_refresh_token = (await verifyToken({
        token: refresh_token,
        publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
      })) as TokenPayload

      if (!decoded_refresh_token) {
        return
      }

      const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_refresh_token.user_id) })

      if (!user) {
        return
      }

      if (user.role !== UserRoleEnum.ADMINISTRATOR && user.role !== UserRoleEnum.SHIPPER) {
        return
      }

      socket.join('freshSync-shipper')
      socket.join(`freshSync-shipper-${user._id}`)
      if (serverLanguage == LANGUAGE.VIETNAMESE) {
        console.log(
          `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36mfreshSync-shipper\x1b[0m`
        )
        console.log(
          `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36mfreshSync-shipper-${user._id}\x1b[0m`
        )
      } else {
        console.log(`\x1b[33mUser \x1b[36m${socket.id}\x1b[33m connected to room \x1b[36mfreshSync-shipper\x1b[0m`)
        console.log(
          `\x1b[33mUser \x1b[36m${socket.id}\x1b[33m connected to room \x1b[36mfreshSync-shipper-${user._id}\x1b[0m`
        )
      }
    } catch {
      return
    }
  })

  socket.on('connect-admin-realtime', async (refresh_token: string) => {
    // Phòng: freshSync-admin
    // sự kiện:
    // ban-account: Cập nhật thông tin người dùng vừa bị cấm
    // unban-account: Cập nhật thông tin người dùng vừa mở khóa
    // create-account: Cập nhật thông tin tài khoản vừa được tạo
    //

    if (!refresh_token) {
      return
    }

    try {
      const decoded_refresh_token = (await verifyToken({
        token: refresh_token,
        publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
      })) as TokenPayload

      if (!decoded_refresh_token) {
        return
      }

      const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_refresh_token.user_id) })

      if (!user) {
        return
      }

      if (user.role != UserRoleEnum.ADMINISTRATOR) {
        return
      }

      socket.join('freshSync-admin')
      if (serverLanguage == LANGUAGE.VIETNAMESE) {
        console.log(
          `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36mfreshSync-admin\x1b[0m`
        )
      } else {
        console.log(`\x1b[33mUser \x1b[36m${socket.id}\x1b[33m connected to room \x1b[36mfreshSync-admin\x1b[0m`)
      }
    } catch {
      return
    }
  })

  socket.on('connect-payment-realtime', async (order_id: string) => {
    // Phòng: freshSync-payment-<order_id>
    // sự kiện:
    // payment_notification: Cập nhật thông tin thanh toán
    //

    socket.join(`freshSync-payment-${order_id}`)
    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      console.log(
        `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36mfreshSync-payment-${order_id}\x1b[0m`
      )
    } else {
      console.log(
        `\x1b[33mUser \x1b[36m${socket.id}\x1b[33m connected to room \x1b[36mfreshSync-payment-${order_id}\x1b[0m`
      )
    }
  })

  socket.on('connect-statistical-realtime', async (refresh_token: string) => {
    // Phòng: freshSync-statistical
    // sự kiện:
    // update-chart: Cập nhật thông tin thống kê chart
    // update-order-complete: Cập nhật thông tin thống kê đơn hàng gần đây
    //

    if (!refresh_token) {
      return
    }

    try {
      const decoded_refresh_token = (await verifyToken({
        token: refresh_token,
        publicKey: process.env.SECURITY_JWT_SECRET_REFRESH_TOKEN as string
      })) as TokenPayload

      if (!decoded_refresh_token) {
        return
      }

      const user = await databaseService.users.findOne({ _id: new ObjectId(decoded_refresh_token.user_id) })

      if (!user) {
        return
      }

      if (user.role != UserRoleEnum.ADMINISTRATOR) {
        return
      }

      socket.join('freshSync-statistical')
      if (serverLanguage == LANGUAGE.VIETNAMESE) {
        console.log(
          `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36mfreshSync-statistical\x1b[0m`
        )
      } else {
        console.log(`\x1b[33mUser \x1b[36m${socket.id}\x1b[33m connected to room \x1b[36mfreshSync-statistical\x1b[0m`)
      }
    } catch {
      return
    }
  })

  socket.on('disconnect', () => {
    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      console.log(
        `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã ngắt kết nối đến máy chủ \x1b[36m${process.env.TRADEMARK_NAME} ${port}\x1b[0m`
      )
    } else {
      console.log(
        `\x1b[33mUser \x1b[36m${socket.id}\x1b[33m has disconnected from the \x1b[36m${process.env.TRADEMARK_NAME} ${port} server.\x1b[0m`
      )
    }
  })
})

server.listen(port, async () => {
  if (serverLanguage == LANGUAGE.VIETNAMESE) {
    await writeInfoLog(`Thời gian chạy máy chủ ${formatDateFull2(serverRunningTime)}`)
    console.log()
    console.log(`\x1b[33mThời gian chạy máy chủ \x1b[36m${formatDateFull2(serverRunningTime)}\x1b[0m`)
    console.log()
    await startBot()
    runAllCrons()
    console.log()
    console.log(`\x1b[33mMáy chủ đang chạy trên port \x1b[36m${port}\x1b[0m`)
    console.log(`\x1b[33mTruy cập tại: \x1b[36m${process.env.API_URL}/\x1b[0m`)
    console.log()
  } else {
    await writeInfoLog(`Server running time ${formatDateFull2(serverRunningTime)}`)
    console.log()
    console.log(`\x1b[33mServer running time \x1b[36m${formatDateFull2(serverRunningTime)}\x1b[0m`)
    console.log()
    await startBot()
    runAllCrons()
    console.log()
    console.log(`\x1b[33mServer is running on port \x1b[36m${port}\x1b[0m`)
    console.log(`\x1b[33mAccess at: \x1b[36m${process.env.API_URL}/\x1b[0m`)
    console.log()
  }
})

process.on('SIGINT', async () => {
  if (serverLanguage == LANGUAGE.VIETNAMESE) {
    const date = new Date()
    console.log()
    console.log(`\x1b[33mMáy chủ đã ngừng hoạt động\x1b[0m`)
    console.log()
    await stopBot()
    await writeInfoLog(`Thời gian tắt máy chủ ${formatDateFull2(date)}`)
    console.log()
    console.log(`\x1b[33mThời gian tắt máy chủ \x1b[36m${formatDateFull2(date)}\x1b[0m`)
    console.log()
    process.exit(0)
  } else {
    const date = new Date()
    console.log()
    console.log(`\x1b[33mServer has stopped working\x1b[0m`)
    console.log()
    await stopBot()
    await writeInfoLog(`Server shutdown time ${formatDateFull2(date)}`)
    console.log()
    console.log(`\x1b[33mServer shutdown time \x1b[36m${formatDateFull2(date)}\x1b[0m`)
    console.log()
    process.exit(0)
  }
})

export { io, serverRunningTime, serverLanguage }
