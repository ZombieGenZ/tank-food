// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import axios from 'axios'

export const autoCallService = async () => {
  try {
    await axios.get(process.env.RENDER_URL as string)
  } catch (error) {
    console.error('\x1b[31mError calling API:\x1b[33m', error)
  }
};
