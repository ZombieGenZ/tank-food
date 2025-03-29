import {
  Client,
  EmbedBuilder,
  IntentsBitField,
  Partials,
  TextChannel,
  User,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js'
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
  },
  id: string
): Promise<{ user_id: string; message_id: string }[]> => {
  const sentMessages: { user_id: string; message_id: string }[] = []

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

    const replyButton = new ButtonBuilder()
      .setCustomId(`reply_${id}`)
      .setLabel(serverLanguage == LANGUAGE.VIETNAMESE ? 'Phản hồi' : 'Response')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('📧')

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(replyButton)

    for (const userId of userIds) {
      try {
        const user: User = await client.users.fetch(userId)
        if (user) {
          const sentMessage = await user.send({
            embeds: [embed],
            components: [row]
          })
          sentMessages.push({ user_id: userId, message_id: sentMessage.id })
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

    client.on('interactionCreate', async (interaction) => {
      if (interaction.isButton()) {
        if (!interaction.customId.startsWith('reply_')) return
        if (!userIds.includes(interaction.user.id)) return

        const modal = new ModalBuilder().setCustomId(`reply_modal_${id}`).setTitle('Phản hồi')

        const replyInput = new TextInputBuilder()
          .setCustomId('reply_content')
          .setLabel(serverLanguage == LANGUAGE.VIETNAMESE ? 'Nội dung phản hồi' : 'Response content')
          .setPlaceholder(serverLanguage == LANGUAGE.VIETNAMESE ? 'Nhập nội dung phản hồi' : 'Enter response content')
          .setStyle(TextInputStyle.Paragraph)
          .setMinLength(1)
          .setMaxLength(4000)
          .setRequired(true)

        const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(replyInput)
        modal.addComponents(actionRow)

        try {
          await interaction.showModal(modal)
        } catch (error) {
          if (serverLanguage === LANGUAGE.VIETNAMESE) {
            console.error('\x1b[31mLỗi khi hiển thị modal:\x1b[33m', error)
            console.log('\x1b[0m')
          } else {
            console.error('\x1b[31mError displaying modal:\x1b[33m', error)
            console.log('\x1b[0m')
          }
        }
      }

      if (interaction.isModalSubmit()) {
        if (!interaction.customId.startsWith('reply_modal_')) return
        if (!userIds.includes(interaction.user.id)) return

        // Defer ngay lập tức để tránh timeout
        let deferred = false
        try {
          await interaction.deferReply({ ephemeral: true })
          deferred = true
        } catch (deferError) {
          if (serverLanguage === LANGUAGE.VIETNAMESE) {
            console.error('\x1b[31mLỗi khi defer interaction:\x1b[33m', deferError)
            console.log('\x1b[0m')
          } else {
            console.error('\x1b[31mError deferring interaction:\x1b[33m', deferError)
            console.log('\x1b[0m')
          }
          return
        }

        const replyContent = interaction.fields.getTextInputValue('reply_content')

        try {
          const response = await fetch(`${process.env.API_URL}/api/contact/response`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Apikey ${process.env.DISCORD_RESPONSE_API_KEY}`
            },
            body: JSON.stringify({
              contact_id: id,
              user_id: interaction.user.id,
              reply_content: replyContent,
              timestamp: new Date().toISOString()
            }),
            signal: AbortSignal.timeout(60 * 1000)
          })

          if (response.ok) {
            await interaction.editReply({
              content:
                serverLanguage == LANGUAGE.VIETNAMESE ? 'Đã gửi phản hồi thành công!' : 'Response sent successfully!'
            })
          } else {
            await interaction.editReply({
              content: serverLanguage == LANGUAGE.VIETNAMESE ? 'Có lỗi khi gửi phản hồi!' : 'Error sending response!'
            })
          }
        } catch (error) {
          if (deferred) {
            await interaction.editReply({
              content:
                serverLanguage == LANGUAGE.VIETNAMESE
                  ? 'Có lỗi khi gửi phản hồi, vui lòng thử lại sau.'
                  : 'Error sending response, please try again later.'
            })
          } else {
            if (serverLanguage === LANGUAGE.VIETNAMESE) {
              console.error('\x1b[31mLỗi khi gửi phản hồi (chưa defer):\x1b[33m', error)
              console.log('\x1b[0m')
            } else {
              console.error('\x1b[31mError sending response (not deferred):\x1b[33m', error)
              console.log('\x1b[0m')
            }
          }
        }
      }
    })

    return sentMessages
  } catch (error) {
    if (serverLanguage === LANGUAGE.VIETNAMESE) {
      console.error('\x1b[31mLỗi khi gửi thông báo nhúng đến tin nhắn riêng của người dùng:\x1b[33m', error)
      console.log('\x1b[0m')
    } else {
      console.error('\x1b[31mError sending embed to users DMs:\x1b[33m', error)
      console.log('\x1b[0m')
    }
    return sentMessages
  }
}

export const hideReplyButton = async (
  sentMessages: { user_id: string; message_id: string }[],
  replyData?: { user_id: string; reply_content: string },
  time?: number
): Promise<void> => {
  for (const { user_id, message_id } of sentMessages) {
    try {
      const user: User = await client.users.fetch(user_id)
      if (!user) {
        if (serverLanguage === LANGUAGE.VIETNAMESE) {
          console.error(`\x1b[31mKhông tìm thấy user với ID: \x1b[33m${user_id}\x1b[33m`)
          console.log('\x1b[0m')
        } else {
          console.error(`\x1b[31mUser not found with ID: \x1b[33m${user_id}\x1b[33m`)
          console.log('\x1b[0m')
        }
        continue
      }

      const dmChannel = await user.createDM()
      const message = await dmChannel.messages.fetch(message_id)
      if (!message) {
        if (serverLanguage === LANGUAGE.VIETNAMESE) {
          console.error(
            `\x1b[31mKhông tìm thấy message với ID: \x1b[33m${message_id}\x1b[31m cho user \x1b[33m${user_id}\x1b[33m`
          )
          console.log('\x1b[0m')
        } else {
          console.error(
            `\x1b[31mMessage not found with ID: \x1b[33m${message_id}\x1b[31m for user \x1b[33m${user_id}\x1b[33m`
          )
          console.log('\x1b[0m')
        }
        continue
      }

      const existingEmbed = message.embeds[0]
      const updatedEmbed = new EmbedBuilder()
        .setAuthor(existingEmbed.author ? { name: existingEmbed.author.name } : null)
        .setTitle(existingEmbed.title || null)
        .setDescription(existingEmbed.description || null)
        .setImage(existingEmbed.image?.url || null)
        .setFooter(existingEmbed.footer ? { text: existingEmbed.footer.text } : null)
        .setColor((existingEmbed.color || null) as any)
        .setThumbnail(existingEmbed.thumbnail?.url || null)
        .setURL(existingEmbed.url || null)

      if (replyData) {
        const replyText = `\n\nPhản hồi bởi: <@${replyData.user_id}>\nNội dung: ||${replyData.reply_content}||\nPhản hồi lúc: <t:${time || 0}:F> (<t:${time || 0}:R>)`
        updatedEmbed.setDescription((existingEmbed.description || '') + replyText)
      }

      await message.edit({
        embeds: [updatedEmbed],
        components: []
      })
    } catch (error) {
      if (serverLanguage === LANGUAGE.VIETNAMESE) {
        console.error(`\x1b[31mLỗi khi chỉnh sửa message cho user \x1b[33m${user_id}\x1b[31m:\x1b[33m`, error)
        console.log('\x1b[0m')
      } else {
        console.error(`\x1b[31mError editing message for user \x1b[33m${user_id}\x1b[31m:\x1b[33m`, error)
        console.log('\x1b[0m')
      }
    }
  }
}
