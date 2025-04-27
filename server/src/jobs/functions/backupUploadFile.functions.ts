// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { LANGUAGE } from '~/constants/language.constants'
import { serverLanguage } from '~/index'
import { uploadPuclicFolder } from '~/utils/drive.utils'

export const backupPublicFolder = async () => {
  const date = new Date()
  if (serverLanguage == LANGUAGE.VIETNAMESE) {
    console.log('\x1b[33mĐang thực hiện sao lưu folder \x1b[36mUpload\x1b[33m...\x1b[0m')
  } else {
    console.log('\x1b[33mPerforming backup of the \x1b[36mUpload\x1b[33m folder...\x1b[0m')
  }
  await uploadPuclicFolder(date)
  if (serverLanguage == LANGUAGE.VIETNAMESE) {
    console.log('\x1b[33mSao lưu folder \x1b[36mUpload\x1b[33m thành công!\x1b[0m')
  } else {
    console.log('\x1b[33mBackup of the \x1b[36mUpload\x1b[33m folder successful!\x1b[0m')
  }
}
