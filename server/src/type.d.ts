import { Request } from 'express'
import { Server as SocketIOServer } from 'socket.io'

declare module 'express' {
  interface Request {
    io?: SocketIOServer
  }
}
