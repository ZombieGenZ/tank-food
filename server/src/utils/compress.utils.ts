// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import fs from 'fs'
import archiver from 'archiver'
import path from 'path'
import { formatDateFull, formatDateFull2 } from './date.utils'
import { serverLanguage } from '~/index'
import { LANGUAGE } from '~/constants/language.constants'

const MAX_BACKUP_FILES = Number(process.env.MAX_BACKUP_FILES as string) || 14

export const compressPuclicFolder = async (date: Date) => {
  const sourceDirectory = path.join(__dirname, '../../public/images/upload')
  const backupDir = path.join(__dirname, '../../backups')
  const outputZipFile = path.join(backupDir, `${formatDateFull(date)}-${process.env.TRADEMARK_NAME}-Upload.zip`)

  async function zipDirectory(source: string, out: string, date: Date): Promise<void> {
    const archive = archiver('zip', {
      zlib: { level: 9 },
      comment:
        serverLanguage == LANGUAGE.VIETNAMESE
          ? `Bản quyền thuộc về ${process.env.TRADEMARK_NAME}\nLiên hệ chúng tôi: ${process.env.SUPPORT_EMAIL}\nThời gian tạo: ${formatDateFull2(date)}`
          : `Copyright belongs to ${process.env.TRADEMARK_NAME}\nContact us: ${process.env.SUPPORT_EMAIL}\nCreation time: ${formatDateFull2(date)}`
    })
    const stream = fs.createWriteStream(out)

    return new Promise<void>((resolve, reject) => {
      archive
        .directory(source, false, (entry) => {
          if (entry.name === '.gitkeep') {
            return false
          }
          return entry
        })
        .on('error', (err) => reject(err))
        .pipe(stream)
  
      stream.on('close', () => resolve())
      archive.finalize()
    })
  }

  async function manageBackupFiles() {
    try {
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true })
      }

      const files = fs
        .readdirSync(backupDir)
        .filter((file) => file.endsWith('.zip'))
        .map((file) => ({
          name: file,
          time: fs.statSync(path.join(backupDir, file)).mtime.getTime()
        }))
        .sort((a, b) => a.time - b.time)

      if (files.length > MAX_BACKUP_FILES) {
        const filesToDelete = files.slice(0, files.length - MAX_BACKUP_FILES)
        for (const file of filesToDelete) {
          fs.unlinkSync(path.join(backupDir, file.name))
          if (serverLanguage == LANGUAGE.VIETNAMESE) {
            console.log(`\x1b[33mĐã xóa file backup cũ: \x1b[36m${file.name}\x1b[0m`)
          } else {
            console.log(`\x1b[33mDeleted old backup file: \x1b[36m${file.name}\x1b[0m`)
          }
        }
      }
    } catch (err) {
      if (serverLanguage == LANGUAGE.VIETNAMESE) {
        console.log(`\x1b[31mLỗi khi quản lý file backup: \x1b[33m${err}\x1b[0m`)
      } else {
        console.log(`\x1b[31mError managing backup file: \x1b[33m${err}\x1b[0m`)
      }
    }
  }

  try {
    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      console.log('\x1b[33mĐang bắt đầu nén thư mục \x1b[36mUpload\x1b[33m...\x1b[0m')
    } else {
      console.log('\x1b[33mStarting to compress the \x1b[36mUpload\x1b[33m folder...\x1b[0m')
    }
    await zipDirectory(sourceDirectory, outputZipFile, date)
    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      console.log('\x1b[33mNén thư mục \x1b[36mUpload\x1b[33m thành công!\x1b[0m')
    } else {
      console.log('\x1b[33mFolder \x1b[36mUpload\x1b[33m compressed successfully!\x1b[0m')
    }

    await manageBackupFiles()
  } catch (err) {
    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      console.log('\x1b[31mNén thư mục \x1b[36mUpload\x1b[31m thất bại!\x1b[0m')
    } else {
      console.log('\x1b[31mFolder \x1b[36mUpload\x1b[31m compression failed!\x1b[0m')
    }
  }
}
