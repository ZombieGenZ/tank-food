import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/jwt.constants'

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
