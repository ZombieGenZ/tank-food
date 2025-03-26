import { Client, EmbedBuilder, IntentsBitField, Partials, TextChannel, User } from 'discord.js'
import { LANGUAGE } from '~/constants/language.constants'
import { serverLanguage } from '~/index'

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.DirectMessages],
  partials: [Partials.Channel]
})

export const startBot = async (): Promise<void> => {
  try {
    await client.login(process.env.DISCORD_BOT_TOKEN)
    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      console.log('\x1b[33mBot Discord đã được bật!\x1b[0m')
    } else {
      console.log('\x1b[33mBot Discord đã được bật!\x1b[0m')
    }
    client.user?.setActivity(`${process.env.APP_URL}/`, { type: 2 })
  } catch (error) {
    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      console.error('\x1b[31mLỗi khi khởi động bot:\x1b[33m', error)
      console.log('\x1b[0m')
    } else {
      console.error('\x1b[31mError starting bot:\x1b[33m', error)
      console.log('\x1b[0m')
    }
  }
}

export const stopBot = async (): Promise<void> => {
  try {
    await client.destroy()
    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      console.log('\x1b[33mBot Discord đã được tắt.\x1b[0m')
    } else {
      console.log('\x1b[33mDiscord Bot has been turned off.\x1b[0m')
    }
  } catch (error) {
    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      console.error('\x1b[31mLỗi khi tắt bot:\x1b[33m', error)
      console.log('\x1b[0m')
    } else {
      console.error('\x1b[31mError turning off bot:\x1b[33m', error)
      console.log('\x1b[0m')
    }
  }
}

export const sendMessageToDiscord = async (channelId: string, message: string): Promise<void> => {
  try {
    const channel = await client.channels.fetch(channelId)
    if (channel && channel.isTextBased()) {
      await (channel as TextChannel).send(message)
    } else {
      if (serverLanguage == LANGUAGE.VIETNAMESE) {
        console.error(`\x1b[31mKhông tìm thấy kênh \x1b[33m${channelId}\x1b[31m hoặc kênh này không có dạng văn bản.`)
        console.log('\x1b[0m')
      } else {
        console.error(`\x1b[31mChannel \x1b[33m${channelId}\x1b[31m not found or is not a text channel`)
        console.log('\x1b[0m')
      }
    }
  } catch (error) {
    if (serverLanguage == LANGUAGE.VIETNAMESE) {
      console.error('\x1b[31mLỗi khi gửi tin nhắn đến Discord:\x1b[33m', error)
      console.log('\x1b[0m')
    } else {
      console.error('\x1b[31mError sending message to Discord:\x1b[33m', error)
      console.log('\x1b[0m')
    }
  }
}

export const sendEmbedMessageToUsersDM = async (
  userIds: string[],
  embedData: {
    author?: string
    title?: string
    content?: string
    imageUrl?: string
    footer?: string
    colorHex?: string
    thumbnailUrl?: string
    embedUrl?: string
  }
): Promise<void> => {
  try {
    const embed = new EmbedBuilder()

    if (embedData.author) embed.setAuthor({ name: embedData.author })
    if (embedData.title) embed.setTitle(embedData.title)
    if (embedData.content) embed.setDescription(embedData.content)
    if (embedData.imageUrl) embed.setImage(embedData.imageUrl)
    if (embedData.footer) embed.setFooter({ text: embedData.footer })
    if (embedData.colorHex) embed.setColor(embedData.colorHex as any)
    if (embedData.thumbnailUrl) embed.setThumbnail(embedData.thumbnailUrl)
    if (embedData.embedUrl) embed.setURL(embedData.embedUrl)

    for (const userId of userIds) {
      try {
        const user: User = await client.users.fetch(userId)
        if (user) {
          await user.send({ embeds: [embed] })
          if (serverLanguage === LANGUAGE.VIETNAMESE) {
            console.log(`\x1b[32mĐã gửi embed thành công đến người dùng ${userId}\x1b[0m`)
          } else {
            console.log(`\x1b[32mSuccessfully sent embed to user ${userId}\x1b[0m`)
          }
        } else {
          if (serverLanguage === LANGUAGE.VIETNAMESE) {
            console.error(`\x1b[31mKhông tìm thấy người dùng \x1b[33m${userId}\x1b[0m`)
          } else {
            console.error(`\x1b[31mUser \x1b[33m${userId}\x1b[31m not found\x1b[0m`)
          }
        }
      } catch (userError) {
        if (serverLanguage === LANGUAGE.VIETNAMESE) {
          console.error(`\x1b[31mLỗi khi gửi tin nhắn đến người dùng \x1b[33m${userId}\x1b[31m:\x1b[33m`, userError)
          console.log('\x1b[0m')
        } else {
          console.error(`\x1b[31mError sending message to user \x1b[33m${userId}\x1b[31m:\x1b[33m`, userError)
          console.log('\x1b[0m')
        }
      }
    }
  } catch (error) {
    if (serverLanguage === LANGUAGE.VIETNAMESE) {
      console.error('\x1b[31mLỗi khi gửi embed đến DM của người dùng:\x1b[33m', error)
      console.log('\x1b[0m')
    } else {
      console.error('"\x1b[31mError sending embed to users\' DMs:\x1b[33m"', error)
      console.log('\x1b[0m')
    }
  }
}
