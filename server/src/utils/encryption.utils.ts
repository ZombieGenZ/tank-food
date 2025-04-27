// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { createHash } from 'node:crypto'

function sha512(content: string) {
  return createHash('sha512').update(content).digest('hex')
}

export function HashPassword(password: string) {
  return sha512(password) + process.env.SECURITY_PASSWORD_SECRET
}
