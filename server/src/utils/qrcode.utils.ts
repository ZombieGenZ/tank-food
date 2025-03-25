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
