import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import databaseService from './services/database.services'
import { startBot, stopBot } from './utils/discord.utils'
import { writeInfoLog } from './utils/log.utils'
import { formatDateFull2 } from './utils/date.utils'
import { LANGUAGE } from './constants/language.constants'
import { defaultErrorHandler } from './middlewares/errors.middlewares'

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
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('trust proxy', true)

app.get('/', (req, res) => {
  res.send('Hello world')
})

// import api router
import api_users from '~/routes/users.routes'
import api_categories from '~/routes/categories.routes'
import api_products from '~/routes/products.routes'

app.use('/api/users', api_users)
app.use('/api/categories', api_categories)
app.use('/api/products', api_products)

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
    // new-category: Cập nhật danh mục mới
    // update-category: Cập nhật danh mục đã có
    // delete-category: Xóa danh mục
    //
    // mô tả chi tiết sự kiện:
    // sự kiện: update-balance
    // mô tả: cập nhật thông tin số dư của người dùng
    // dử liệu: type, value
    // type: loại phàn hồi (gồm 2 loại '+' và '-')
    // value: giá trị của phản hồi
    //
    // sự kiện: update-revenue
    // mô tả: cập nhật thông tin doanh thu của doanh nghiệp/quản trị viên
    // dử liệu: type, value
    // type: loại phàn hồi (gồm 2 loại '+' và '-')
    // value: giá trị của phản hồi
    //
    // sự kiện: new-private-notificaton
    // mô tả: cập nhật thông báo mới cho người dùng
    // dử liệu: sender, message
    // sender: là người gửi thông báo
    // message: tin nhắn được gửi tới

    socket.join(`freshSync`)
    console.log(`\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến phòng \x1b[36mfreshSync\x1b[0m`)
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
