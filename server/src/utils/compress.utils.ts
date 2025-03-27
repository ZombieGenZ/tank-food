import fs from 'fs'
import archiver from 'archiver'
import path from 'path'
import { formatDateFull, formatDateFull2 } from './date.utils'

const zipPassword = process.env.BACKUP_PASSWORD as string

export const compressPuclicFolder = async (date: Date) => {
  const sourceDirectory = path.join(__dirname, '../../../client/public/images/upload')
  const outputZipFile = path.join(
    __dirname,
    `../../backups/${formatDateFull(date)}-${process.env.TRADEMARK_NAME}-Upload.zip`
  )

  async function zipDirectory(source: string, out: string, date: Date, password: string): Promise<void> {
    const archive = archiver('zip', {
      zlib: { level: 9 },
      comment: `Bản quyền thuộc về ${process.env.TRADEMARK_NAME}\nLiên hệ chúng tôi: ${process.env.SUPPORT_EMAIL}\nThời gian tạo: ${formatDateFull2(date)}`
    })
    const stream = fs.createWriteStream(out)

    return new Promise<void>((resolve, reject) => {
      archive
        .directory(source, false)
        .on('error', (err) => reject(err))
        .pipe(stream)

      stream.on('close', () => resolve())
      archive.finalize()
    })
  }

  try {
    console.log('\x1b[33mĐamg bắt đầu nén thư mục \x1b[36mUpload\x1b[33m...\x1b[0m')
    await zipDirectory(sourceDirectory, outputZipFile, date, zipPassword)
    console.log('\x1b[33mNén thư mục \x1b[36mUpload\x1b[33m thành công!\x1b[0m')
  } catch (err) {
    console.log('\x1b[31mNén thư mục \x1b[36mUpload\x1b[31m thất bại!\x1b[0m')
  }
}
