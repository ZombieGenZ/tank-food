// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { db } from '~/services/firebase.services'
import { io } from '~/index'

export const notificationRealtime = async (
  socketRoom: string,
  socketEvent: string,
  firebasePath: string,
  data: any
) => {
  const firebaseDatabase = db.ref(firebasePath).push()

  firebaseDatabase.set(data)
  io.to(socketRoom).emit(socketEvent, data)
}
