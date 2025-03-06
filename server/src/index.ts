import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'

dotenv.config()
const port = process.env.APP_PORT || 3000

const app = express()
const server = createServer(app)
const serverRunningTime = new Date()
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

// realtime logic
io.on('connection', (socket: Socket) => {
  console.log(
    `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã kết nối đến máy chủ \x1b[36m${process.env.TRADEMARK_NAME} ${port}\x1b[0m`
  )

  socket.on('join-room', async (refresh_token: string) => {
    // code join room realtime
  })

  socket.on('disconnect', () => {
    console.log(
      `\x1b[33mNgười dùng \x1b[36m${socket.id}\x1b[33m đã ngắt kết nối đến máy chủ \x1b[36m${process.env.TRADEMARK_NAME} ${port}\x1b[0m`
    )
  })
})

server.listen(port, async () => {
  console.log()
  console.log(`\x1b[33mThời gian chạy máy chủ \x1b[36m${serverRunningTime}\x1b[0m`)
  console.log()
  console.log(`\x1b[33mMáy chủ đang chạy trên port \x1b[36m${port}\x1b[0m`)
  console.log(`\x1b[33mTruy cập tại: \x1b[36m${process.env.APP_URL}/\x1b[0m`)
  console.log()
})

process.on('SIGINT', async () => {
  const date = new Date()
  console.log()
  console.log(`\x1b[33mMáy chủ đã ngừng hoạt động\x1b[0m`)
  console.log()
  console.log(`\x1b[33mThời gian tắt máy chủ \x1b[36m${date}\x1b[0m`)
  console.log()
  process.exit(0)
})

export { io, serverRunningTime }
