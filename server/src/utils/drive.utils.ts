import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { formatDateFull } from './date.utils'
import { compressPuclicFolder } from './compress.utils'
import databaseService from '~/services/database.services'
import BackupLog from '~/models/schemas/backup_logs.shemas'

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

export const uploadPuclicFolder = async (date: Date) => {
  try {
    await compressPuclicFolder(date)

    console.log('\x1b[33mĐang bắt đầu tải lên thư mục \x1b[36mUpload\x1b[33m...\x1b[0m')

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID as string

    const drive = google.drive({
      version: 'v3',
      auth
    })

    const filePath = path.join(
      __dirname,
      `../../backups/${formatDateFull(date)}-${process.env.TRADEMARK_NAME}-Upload.zip`
    )

    try {
      await drive.files.get({
        fileId: folderId,
        fields: 'id,name'
      })
    } catch (error: any) {
      console.error(error.response.data)
      console.error(
        '\x1b[31mKhông tìm thấy thư mục đích trên Google Drive. Vui lòng kiểm tra GOOGLE_DRIVE_FOLDER_ID.\x1b[0m'
      )
      return
    }

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

    console.log('\x1b[33mTải lên thư mục \x1b[36mUpload\x1b[33m thành công!\x1b[0m')

    const driveLink = `https://drive.google.com/file/d/${response.data.id}/view`
    await databaseService.backupLog.insertOne(
      new BackupLog({
        file_id: response.data.id as string,
        drive_url: driveLink,
        created_at: date
      })
    )
  } catch (error) {
    console.error('\x1b[31mTải lên thư mục \x1b[36mUpload\x1b[31m thất bại!\x1b[0m', error)
  }
}
