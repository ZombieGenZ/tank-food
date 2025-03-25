import { Request } from 'express'
import { Server as SocketIOServer } from 'socket.io'
import { TokenPayload } from '~/models/requests/authentication.requests'
import User from '~/models/schemas/users.schemas'
import RefreshToken from './models/schemas/refreshtoken.schemas'
import Category from './models/schemas/categories.schemas'
import { ImageType } from './constants/images.constants'
import Product from './models/schemas/product.schemas'
import Order from './models/schemas/orders.schemas'

declare module 'express' {
  interface Request {
    io?: SocketIOServer
    user?: User
    decoded_access_token?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
    refresh_token?: RefreshToken
    category?: Category
    product?: Product
    image?: ImageType
    total_quantity?: number
    total_price?: number
    product_list?: ProductList
    order?: Order
    banned_time?: Date
  }
}
