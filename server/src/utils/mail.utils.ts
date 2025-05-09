// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import nodemailer from 'nodemailer'
import { OAuth2Client } from 'google-auth-library'
import * as SMTPTransport from 'nodemailer/lib/smtp-transport'
import { generateQRCodeAttachment } from './qrcode.utils'
import { MailOptions } from '~/constants/mail.constants'

const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID as string
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET as string
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.GOOGLE_MAILER_REFRESH_TOKEN as string
const GOOGLE_MAILER_EMAIL_PRIMARY_ADDRESS = process.env.GOOGLE_MAILER_EMAIL_PRIMARY_ADDRESS as string
const GOOGLE_MAILER_EMAIL_SEND_ADDRESS = process.env.GOOGLE_MAILER_EMAIL_SEND_ADDRESS as string

const MailClient = new OAuth2Client(GOOGLE_MAILER_CLIENT_ID, GOOGLE_MAILER_CLIENT_SECRET)

MailClient.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
})

export const sendMail = async (
  to: string,
  subject: string,
  html: string,
  option?: MailOptions,
  fromEmail: string = GOOGLE_MAILER_EMAIL_SEND_ADDRESS
) => {
  try {
    const access_token_object = await MailClient.getAccessToken()
    const access_token = access_token_object?.token as string

    const transportOptions: SMTPTransport.Options = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: GOOGLE_MAILER_EMAIL_PRIMARY_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: access_token
      }
    }

    const transport = nodemailer.createTransport(transportOptions)

    const mailOptions: nodemailer.SendMailOptions = {
      from: fromEmail,
      to,
      subject,
      html,
      attachments: []
    }

    if (option?.qrCodeUrl) {
      const qrAttachment = await generateQRCodeAttachment(option.qrCodeUrl)
      mailOptions.attachments!.push(qrAttachment)
      mailOptions.html = html.replace('src="${qrCode}"', 'src="cid:ticket-qr"')
    }

    if (option?.excelAttachment?.buffer) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const excelFileName = option.excelAttachment.fileName || `Statistical_Report_${timestamp}.xlsx`

      mailOptions.attachments!.push({
        filename: excelFileName,
        content: option.excelAttachment.buffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }

    await transport.sendMail(mailOptions)

    return true
  } catch (err) {
    console.error('Error sending email:', err)
    return false
  }
}