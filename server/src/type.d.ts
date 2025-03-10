import { Request } from 'express'
import { Server as SocketIOServer } from 'socket.io'
import User from '~/models/schemas/users.schemas'

declare module 'express' {
  interface Request {
    io?: SocketIOServer
    user?: User
  }
}
