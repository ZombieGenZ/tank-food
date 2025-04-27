// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import QRCode from 'qrcode'

export const generateQRCodeAttachment = async (text: string) => {
  try {
    const qrBuffer = await QRCode.toBuffer(text)
    return {
      filename: `${process.env.TRADEMARK_NAME}-bill-qr.png`,
      content: qrBuffer,
      contentType: 'image/png',
      cid: 'bill-qr'
    }
  } catch (error) {
    console.error('Lỗi tạo mã QR:', error)
    throw error
  }
}
