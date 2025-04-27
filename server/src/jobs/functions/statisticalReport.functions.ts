// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { LANGUAGE } from '~/constants/language.constants'
import { VIETNAMESE_DYNAMIC_MAIL, ENGLIS_DYNAMIC_MAIL } from '~/constants/mail.constants'
import { UserRoleEnum } from '~/constants/users.constants'
import { serverLanguage } from '~/index'
import databaseService from '~/services/database.services'
import statisticsService from '~/services/statistical.services'
import { reportComment } from '~/utils/ai.utils'
import { formatDateFull, getDaysInMonth, getMonthStartAndEnd } from '~/utils/date.utils'
import { sendMail } from '~/utils/mail.utils'
import { Buffer } from 'node:buffer'

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

  const { buffer, start_date, end_date } = await statisticsService.exportStatistical(time, serverLanguage)
  const fileName = `Statistical_Report_${formatDateFull(start_date)}_${formatDateFull(end_date)}.xlsx`

  const promises = [] as Promise<void>[]

  for (const user of Users) {
    promises.push(
      new Promise((resolve, reject) => {
        try {
          sendMail(user.email, email_subject, email_html, {
            excelAttachment: { buffer, fileName }
          })
          resolve()
        } catch (err) {
          reject()
        }
      })
    )
  }

  await Promise.all(promises)
}
