import { LANGUAGE } from '~/constants/language.constants'
import { ResponseContactRequestsBody, SendContactRequestsBody } from '~/models/requests/contact.requests'
import { hideReplyButton, sendEmbedMessageToUsersDM } from '~/utils/discord.utils'
import { serverLanguage } from '~/index'
import databaseService from './database.services'
import Contact from '~/models/schemas/contact.shemas'
import { formatDateOnlyMinuteAndHour } from '~/utils/date.utils'
import { ObjectId } from 'mongodb'
import { sendMail } from '~/utils/mail.utils'
import { ResponseTypeEnum } from '~/constants/contact.constants'
import { VIETNAMESE_DYNAMIC_MAIL, ENGLIS_DYNAMIC_MAIL } from '~/constants/mail.constants'

class ContactService {
  async send(payload: SendContactRequestsBody) {
    const contact_id = new ObjectId()
    const date = new Date()
    const supportUser = (process.env.SUPPORT_DISCORD_USER_ID as string).split(',')

    let messageData

    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      messageData = await sendEmbedMessageToUsersDM(
        supportUser,
        {
          author: 'TANK-Food website',
          title: `${payload.title}`,
          content: `${payload.content}\n\nThông tin liên hệ:\nĐịa chỉ email: ${payload.email}\nSố điện thoại: ${payload.phone}`,
          footer: `Hệ thống TANK-Food | ${formatDateOnlyMinuteAndHour(date)}`,
          colorHex: '#FF8000',
          embedUrl: process.env.APP_URL
        },
        contact_id.toString()
      )
    } else {
      messageData = await sendEmbedMessageToUsersDM(
        supportUser,
        {
          author: 'TANK-Food website',
          title: `${payload.title}`,
          content: `${payload.content}\n\nContact Information:\nEmail Address: ${payload.email}\nPhone Number: ${payload.phone}`,
          footer: `TANK-Food System | ${formatDateOnlyMinuteAndHour(date)}`,
          colorHex: '#FF8000',
          embedUrl: process.env.APP_URL
        },
        contact_id.toString()
      )
    }

    await databaseService.contact.insertOne(
      new Contact({
        _id: contact_id,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        title: payload.title,
        content: payload.content,
        discord_message_data: messageData,
        created_at: date
      })
    )
  }
  async response(payload: ResponseContactRequestsBody) {
    const contact = await databaseService.contact.findOne({ _id: new ObjectId(payload.contact_id) })

    if (!contact) {
      return
    }

    let email_subject
    let email_html

    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      email_subject = VIETNAMESE_DYNAMIC_MAIL.supportRequestResponse(payload.reply_content).subject
      email_html = VIETNAMESE_DYNAMIC_MAIL.supportRequestResponse(payload.reply_content).html
    } else {
      email_subject = ENGLIS_DYNAMIC_MAIL.supportRequestResponse(payload.reply_content).subject
      email_html = ENGLIS_DYNAMIC_MAIL.supportRequestResponse(payload.reply_content).html
    }

    await Promise.all([
      hideReplyButton(contact.discord_message_data),
      sendMail(contact.email, email_subject, email_html, process.env.SUPPORT_EMAIL as string),
      databaseService.contact.updateOne(
        {
          _id: new ObjectId(payload.contact_id)
        },
        {
          $set: {
            response_type: ResponseTypeEnum.RESPONDED
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])
  }
}

const contactService = new ContactService()
export default contactService
