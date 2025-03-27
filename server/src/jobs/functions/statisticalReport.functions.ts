import { LANGUAGE } from '~/constants/language.constants'
import { VIETNAMESE_DYNAMIC_MAIL, ENGLIS_DYNAMIC_MAIL } from '~/constants/mail.constants'
import { UserRoleEnum } from '~/constants/users.constants'
import { serverLanguage } from '~/index'
import databaseService from '~/services/database.services'
import statisticsService from '~/services/statistical.services'
import { reportComment } from '~/utils/ai.utils'
import { getDaysInMonth, getMonthStartAndEnd } from '~/utils/date.utils'
import { sendMail } from '~/utils/mail.utils'

export const statisticalReport = async () => {
  const currentMonth = new Date()
  const time = getDaysInMonth(currentMonth)

  const Users = await databaseService.users
    .find({
      role: UserRoleEnum.ADMINISTRATOR,
      penalty: null
    })
    .toArray()

  const data = await statisticsService.overview(time)
  const date = getMonthStartAndEnd(currentMonth)
  const comment = await reportComment(date.startTime, date.endTime, serverLanguage, data)

  let email_subject
  let email_html

  if (serverLanguage == LANGUAGE.VIETNAMESE) {
    email_subject = VIETNAMESE_DYNAMIC_MAIL.monthlyReport(currentMonth, data, comment).subject
    email_html = VIETNAMESE_DYNAMIC_MAIL.monthlyReport(currentMonth, data, comment).html
  } else {
    email_subject = ENGLIS_DYNAMIC_MAIL.monthlyReport(currentMonth, data, comment).subject
    email_html = ENGLIS_DYNAMIC_MAIL.monthlyReport(currentMonth, data, comment).html
  }

  const promises = [] as Promise<void>[]

  for (const user of Users) {
    promises.push(
      new Promise((resolve, reject) => {
        try {
          sendMail(user.email, email_subject, email_html)
          resolve()
        } catch (err) {
          reject()
        }
      })
    )
  }

  await Promise.all(promises)
}
