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
