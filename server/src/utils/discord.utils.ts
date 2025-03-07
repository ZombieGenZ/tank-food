import { Client, IntentsBitField, TextChannel } from 'discord.js'

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages]
})

export const startBot = async (): Promise<void> => {
  try {
    await client.login(process.env.DISCORD_BOT_TOKEN)
    console.log('\x1b[33mBot Discord đã được bật!\x1b[0m')

    client.user?.setActivity(`${process.env.APP_URL}/`, { type: 2 })
  } catch (error) {
    console.error('Lỗi khi khởi động bot:', error)
  }
}

export const stopBot = async (): Promise<void> => {
  try {
    await client.destroy()
    console.log('\x1b[33mBot Discord đã được tắt.\x1b[0m')
  } catch (error) {
    console.error('Lỗi khi tắt bot:', error)
  }
}

export const sendMessageToDiscord = async (channelId: string, message: string): Promise<void> => {
  try {
    const channel = await client.channels.fetch(channelId)
    if (channel && channel.isTextBased()) {
      await (channel as TextChannel).send(message)
    } else {
      console.error(`Không tìm thấy kênh ${channelId} hoặc kênh này không có dạng văn bản.`)
    }
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn đến Discord:', error)
  }
}
