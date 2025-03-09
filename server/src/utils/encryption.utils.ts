import { createHash } from 'node:crypto'

function sha512(content: string) {
  return createHash('sha512').update(content).digest('hex')
}

export function HashPassword(password: string) {
  return sha512(password) + process.env.SECURITY_PASSWORD_SECRET
}
