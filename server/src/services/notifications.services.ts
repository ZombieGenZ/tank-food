import { GetNotificationRequestsBody } from '~/models/requests/notifications.requests'
import databaseService from './database.services'
import User from '~/models/schemas/users.schemas'
import Notification from '~/models/schemas/notifications.shemas'
import { notificationRealtime } from '~/utils/realtime.utils'
import { UserRoleEnum } from '~/constants/users.constants'

class NotificationService {
  async getNotification(payload: GetNotificationRequestsBody, user: User) {
    return await databaseService.notification.find({ receiver: user._id }).limit(payload.quantity).toArray()
  }
  async sendNotification(message: string, receiver: User, sender?: string) {
    const notification = new Notification({
      message,
      sender,
      receiver: receiver._id
    })
    await Promise.all([
      databaseService.notification.insertOne(notification),
      notificationRealtime(`freshSync-user-${receiver._id}`, 'new-notification', `notification/${receiver._id}/new-notification`, notification)
    ])
  }
  async sendNotificationAllUser(message: string, sender?: string) {
    const users = await databaseService.users.find({ penalty: { $ne: null } }).toArray()
    const promises = [] as Promise<void>[]
    for (const user of users) {
      promises.push(
        new Promise((resolve, reject) => {
          try {
            const notification = new Notification({
              message,
              sender,
              receiver: user._id
            })

            Promise.all([
              databaseService.notification.insertOne(notification),
              notificationRealtime(`freshSync-user-${user._id}`, 'new-notification', `notification/${user._id}/new-notification`, notification)
            ])
            resolve()
          } catch (err) {
            reject()
          }
        })
      )
    }
    await Promise.all(promises)
  }
  async sendNotificationAllCustomer(message: string, sender?: string) {
    const users = await databaseService.users.find({ role: UserRoleEnum.CUSTOMER, penalty: { $ne: null } }).toArray()
    const promises = [] as Promise<void>[]
    for (const user of users) {
      promises.push(
        new Promise((resolve, reject) => {
          try {
            const notification = new Notification({
              message,
              sender,
              receiver: user._id
            })

            Promise.all([
              databaseService.notification.insertOne(notification),
              notificationRealtime(`freshSync-user-${user._id}`, 'new-notification', `notification/${user._id}/new-notification`, notification)
            ])
            resolve()
          } catch (err) {
            reject()
          }
        })
      )
    }
    await Promise.all(promises)
  }
  async sendNotificationAllEmployee(message: string, sender?: string) {
    const users = await databaseService.users.find({ role: UserRoleEnum.EMPLOYEE, penalty: { $ne: null } }).toArray()
    const promises = [] as Promise<void>[]
    for (const user of users) {
      promises.push(
        new Promise((resolve, reject) => {
          try {
            const notification = new Notification({
              message,
              sender,
              receiver: user._id
            })

            Promise.all([
              databaseService.notification.insertOne(notification),
              notificationRealtime(`freshSync-user-${user._id}`, 'new-notification', `notification/${user._id}/new-notification`, notification)
            ])
            resolve()
          } catch (err) {
            reject()
          }
        })
      )
    }
    await Promise.all(promises)
  }
  async sendNotificationAllShipper(message: string, sender?: string) {
    const users = await databaseService.users.find({ role: UserRoleEnum.SHIPPER, penalty: { $ne: null } }).toArray()
    const promises = [] as Promise<void>[]
    for (const user of users) {
      promises.push(
        new Promise((resolve, reject) => {
          try {
            const notification = new Notification({
              message,
              sender,
              receiver: user._id
            })

            Promise.all([
              databaseService.notification.insertOne(notification),
              notificationRealtime(`freshSync-user-${user._id}`, 'new-notification', `notification/${user._id}/new-notification`, notification)
            ])
            resolve()
          } catch (err) {
            reject()
          }
        })
      )
    }
    await Promise.all(promises)
  }
  async sendNotificationAllAdministrator(message: string, sender?: string) {
    const users = await databaseService.users.find({ role: UserRoleEnum.ADMINISTRATOR, penalty: { $ne: null } }).toArray()
    const promises = [] as Promise<void>[]
    for (const user of users) {
      promises.push(
        new Promise((resolve, reject) => {
          try {
            const notification = new Notification({
              message,
              sender,
              receiver: user._id
            })

            Promise.all([
              databaseService.notification.insertOne(notification),
              notificationRealtime(`freshSync-user-${user._id}`, 'new-notification', `notification/${user._id}/new-notification`, notification)
            ])
            resolve()
          } catch (err) {
            reject()
          }
        })
      )
    }
    await Promise.all(promises)
  }
}

const notificationService = new NotificationService()
export default notificationService
