import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { formatDateFull } from './date.utils'
import { compressPuclicFolder } from './compress.utils'
import databaseService from '~/services/database.services'
import BackupLog from '~/models/schemas/backup_logs.shemas'
import { serverLanguage } from '~/index'
import { LANGUAGE } from '~/constants/language.constants'
import { ppid } from 'process'

const credentials = {
  type: process.env.GOOGLE_DRIVE_TYPE as string,
  project_id: process.env.GOOGLE_DRIVE_PROJECT_ID as string,
  private_key_id: process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID as string,
  private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL as string,
  client_id: process.env.GOOGLE_DRIVE_CLIENT_ID as string,
  auth_uri: process.env.GOOGLE_DRIVE_AUTH_URI as string,
  token_uri: process.env.GOOGLE_DRIVE_TOKEN_URI as string,
  auth_provider_x509_cert_url: process.env.GOOGLE_DRIVE_AUTH_PROVIDER_X509_CERT_URL as string,
  client_x509_cert_url: process.env.GOOGLE_DRIVE_CLIENT_X509_CERT_URL as string
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive']
})

const MAX_BACKUP_FILES = Number(process.env.MAX_BACKUP_FILES as string) || 14

export const uploadPuclicFolder = async (date: Date) => {
  const drive = google.drive({
    version: 'v3',
    auth
  })

  async function manageDriveBackupFiles(folderId: string) {
    try {
      const response = await drive.files.list({
        q: `'${folderId}' in parents`,
        fields: 'files(id, name, createdTime)',
        orderBy: 'createdTime'
      })

      const files = response.data.files || []
      if (files.length >= MAX_BACKUP_FILES) {
        files.sort((a, b) => new Date(a.createdTime!).getTime() - new Date(b.createdTime!).getTime())
        const filesToDelete = files.slice(0, files.length - MAX_BACKUP_FILES + 1)
        for (const file of filesToDelete) {
          try {
            if (serverLanguage === LANGUAGE.VIETNAMESE) {
              console.log(`\x1b[33mĐang xóa file backup cũ trên Google Drive: \x1b[36m${file.name}\x1b[0m`)
            } else {
              console.log(`\x1b[33mDeleting old backup file on Google Drive: \x1b[36m${file.name}\x1b[0m`)
            }

            await Promise.all([
              drive.files.delete({
                fileId: file.id!
              }),
              databaseService.backupLog.deleteOne({ file_id: file.id! })
            ])

            if (serverLanguage === LANGUAGE.VIETNAMESE) {
              console.log(`\x1b[33mĐã xóa file backup cũ trên Google Drive: \x1b[36m${file.name}\x1b[0m`)
            } else {
              console.log(`\x1b[33mDeleted old backup file from Google Drive: \x1b[36m${file.name}\x1b[0m`)
            }
          } catch (error) {
            if (serverLanguage === LANGUAGE.VIETNAMESE) {
              console.error(`\x1b[31mLỗi khi xóa file backup cũ trên Google Drive: ${error}\x1b[0m`)
            } else {
              console.error(`\x1b[31mError deleting old backup file on Google Drive: ${error}\x1b[0m`)
            }
          }
        }
      }
    } catch (error) {
      if (serverLanguage === LANGUAGE.VIETNAMESE) {
        console.error(`\x1b[31mLỗi khi quản lý file backup trên Google Drive: ${error}\x1b[0m`)
      } else {
        console.error(`\x1b[31mError managing backup files on Google Drive: ${error}\x1b[0m`)
      }
    }
  }

  try {
    await compressPuclicFolder(date)

    if (serverLanguage === LANGUAGE.VIETNAMESE) {
      console.log('\x1b[33mĐang bắt đầu tải lên thư mục \x1b[36mUpload\x1b[33m...\x1b[0m')
    } else {
      console.log('\x1b[33mStarting to upload the \x1b[36mUpload\x1b[33m folder...\x1b[0m')
    }

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID as string

    try {
      await drive.files.get({
        fileId: folderId,
        fields: 'id,name'
      })
    } catch (error: any) {
      if (serverLanguage === LANGUAGE.VIETNAMESE) {
        console.error(error.response.data)
        console.error(
          '\x1b[31mKhông tìm thấy thư mục đích trên Google Drive. Vui lòng kiểm tra GOOGLE_DRIVE_FOLDER_ID.\x1b[0m'
        )
      } else {
        console.error(error.response.data)
        console.error(
          '\x1b[31mCould not find the destination folder on Google Drive. Please check GOOGLE_DRIVE_FOLDER_ID.\x1b[0m'
        )
      }
      return
    }

    const filePath = path.join(
      __dirname,
      `../../backups/${formatDateFull(date)}-${process.env.TRADEMARK_NAME}-Upload.zip`
    )

    const response = await drive.files.create({
      requestBody: {
        name: path.basename(filePath),
        mimeType: 'application/zip',
        parents: [folderId]
      },
      media: {
        mimeType: 'application/zip',
        body: fs.createReadStream(filePath)
      },
      fields: 'id'
    })

    if (serverLanguage === LANGUAGE.VIETNAMESE) {
      console.log('\x1b[33mTải lên thư mục \x1b[36mUpload\x1b[33m thành công!\x1b[0m')
    } else {
      console.log('\x1b[33mUpload of the \x1b[36mUpload\x1b[33m folder successful!\x1b[0m')
    }

    const driveLink = `https://drive.google.com/file/d/${response.data.id}/view`
    await databaseService.backupLog.insertOne(
      new BackupLog({
        file_id: response.data.id as string,
        drive_url: driveLink,
        created_at: date
      })
    )

    await manageDriveBackupFiles(folderId)
  } catch (error) {
    if (serverLanguage === LANGUAGE.VIETNAMESE) {
      console.error('\x1b[31mTải lên thư mục \x1b[36mUpload\x1b[31m thất bại!\x1b[0m', error)
    } else {
      console.error('\x1b[31mUpload of the \x1b[36mUpload\x1b[31m folder failed!\x1b[0m', error)
    }
  }
}
