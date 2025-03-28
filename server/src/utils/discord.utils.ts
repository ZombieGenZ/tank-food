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
  contact_id: string
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
      .setCustomId(`reply_${contact_id}`)
      .setLabel('Phản hồi')
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

          if (serverLanguage === LANGUAGE.VIETNAMESE) {
            console.log(`\x1b[33mĐã gửi tin nhắn thành công đến người dùng \x1b[36m${userId}\x1b[0m`)
          } else {
            console.log(`\x1b[33mSuccessfully sent message to user \x1b[36m$\x1b[0m{userId}\x1b[0m`)
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

    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isButton()) return
      if (!interaction.customId.startsWith('reply_')) return

      if (!userIds.includes(interaction.user.id)) return

      const modal = new ModalBuilder().setCustomId(`reply_modal_${contact_id}`).setTitle('Phản hồi')

      const replyInput = new TextInputBuilder()
        .setCustomId('reply_content')
        .setLabel('Nội dung phản hồi')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(1)
        .setMaxLength(4000)
        .setRequired(true)

      const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(replyInput)

      modal.addComponents(actionRow)
      await interaction.showModal(modal)
    })

    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isModalSubmit()) return
      if (!interaction.customId.startsWith('reply_modal_')) return

      try {
        await interaction.deferUpdate()
      } catch (deferError) {
        console.error('Lỗi khi defer button interaction:', deferError)
        return
      }

      if (!userIds.includes(interaction.user.id)) return

      const replyContent = interaction.fields.getTextInputValue('reply_content')

      try {
        await interaction.deferReply({ ephemeral: true })

        const response = await fetch(`${process.env.API_URL}/api/contact/response`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Apikey ${process.env.DISCORD_RESPONSE_API_KEY}`
          },
          body: JSON.stringify({
            contact_id: contact_id,
            user_id: interaction.user.id,
            reply_content: replyContent,
            timestamp: new Date().toISOString()
          }),
          signal: AbortSignal.timeout(60 * 1000)
        })

        console.log(response.json)

        if (response.ok) {
          await interaction.editReply({
            content: 'Đã gửi phản hồi thành công!'
          })
        } else {
          await interaction.editReply({
            content: 'Có lỗi khi gửi phản hồi đến server, vui lòng thử lại sau.'
          })
        }
      } catch (error) {
        await interaction.editReply({
          content: 'Có lỗi khi gửi phản hồi, vui lòng thử lại sau.'
        })
      }
    })

    return sentMessages
  } catch (error) {
    if (serverLanguage === LANGUAGE.VIETNAMESE) {
      console.error('\x1b[31mLỗi khi gửi embed đến DM của người dùng:\x1b[33m', error)
      console.log('\x1b[0m')
    } else {
      console.error('"\x1b[31mError sending embed to users\' DMs:\x1b[33m"', error)
      console.log('\x1b[0m')
    }
    return sentMessages
  }
}

export const hideReplyButton = async (sentMessages: { user_id: string; message_id: string }[]): Promise<void> => {
  for (const { user_id, message_id } of sentMessages) {
    try {
      const user: User = await client.users.fetch(user_id)
      if (!user) {
        console.error(`\x1b[31mKhông tìm thấy user với ID: \x1b[33m${user_id}\x1b[0m`)
        continue
      }

      const dmChannel = await user.createDM()

      const message = await dmChannel.messages.fetch(message_id)
      if (!message) {
        console.error(
          `\x1b[31mKhông tìm thấy message với ID: \x1b[33m${message_id}\x1b[31m cho user \x1b[33m${user_id}\x1b[0m`
        )
        continue
      }

      await message.edit({
        embeds: message.embeds,
        components: []
      })
    } catch (error) {
      console.error(`\x1b[31mLỗi khi chỉnh sửa message cho user\x1b[33m ${user_id}\x1b[31m:\x1b[33m`, error)
    }
  }
}
