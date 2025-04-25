import axios from 'axios'

export const autoCallService = async () => {
  try {
    await axios.get(process.env.RENDER_URL as string)
  } catch (error) {
    console.error('\x1b[31mError calling API:\x1b[33m', error)
  }
};
