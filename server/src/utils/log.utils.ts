// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import LogService from '~/services/log.services'
import { sendMessageToDiscord } from './discord.utils'
import { LogTypeEnum } from '~/constants/logs.constants'
import { formatDateFull2 } from './date.utils'

export const writeInfoLog = async (log_message: string) => {
  await LogService.newLog(LogTypeEnum.INFO, log_message)
}

export const writeWarnLog = async (log_message: string) => {
  await LogService.newLog(LogTypeEnum.WARN, log_message)
}

export const writeErrorLog = async (log_message: string) => {
  const date = new Date()
  await Promise.all([
    LogService.newLog(LogTypeEnum.ERROR, log_message),
    sendMessageToDiscord(
      process.env.DISCORD_ERROR_LOG_CHANNEL_ID as string,
      `[${formatDateFull2(date)} ERROR] ${log_message} | <@&${process.env.DISCORD_DEVOP_ROLE_ID}>`
    )
  ])
}
