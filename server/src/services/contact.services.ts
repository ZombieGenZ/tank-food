import { LANGUAGE } from '~/constants/language.constants'
import { SendContactRequestsBody } from '~/models/requests/contact.requests'
import { sendEmbedMessageToUsersDM } from '~/utils/discord.utils'
import { serverLanguage } from '~/index'
import databaseService from './database.services'
import Contact from '~/models/schemas/contact.shemas'
import { formatDateOnlyMinuteAndHour } from '~/utils/date.utils'

class ContactService {
  async send(payload: SendContactRequestsBody) {
    const date = new Date()
    const supportUser = (process.env.SUPPORT_DISCORD_USER_ID as string).split(',')

    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      await sendEmbedMessageToUsersDM(supportUser, {
        author: 'TANK-Food website',
        title: `${payload.title}`,
        content: `${payload.content}\n\nThông tin liên hệ:\nĐịa chỉ email: ${payload.email}\nSố điện thoại: ${payload.phone}`,
        footer: `Hệ thống TANK-Food | ${formatDateOnlyMinuteAndHour(date)}`,
        colorHex: '#FF8000',
        embedUrl: process.env.APP_URL
      })
    } else {
      await sendEmbedMessageToUsersDM(supportUser, {
        author: 'TANK-Food website',
        title: `${payload.title}`,
        content: `${payload.content}\n\nContact Information:\nEmail Address: ${payload.email}\nPhone Number: ${payload.phone}`,
        footer: `TANK-Food System | ${formatDateOnlyMinuteAndHour(date)}`,
        colorHex: '#FF8000',
        embedUrl: process.env.APP_URL
      })
    }

    await databaseService.contact.insertOne(
      new Contact({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        title: payload.title,
        content: payload.content,
        created_at: date
      })
    )
  }
}

const contactService = new ContactService()
export default contactService
