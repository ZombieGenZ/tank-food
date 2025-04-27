// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import {
  CreateVoucherRequestsBody,
  UpdateVoucherRequestsBody,
  DeleteVoucherRequestsBody,
  StorageVoucherRequestsBody
} from '~/models/requests/voucherPublic.requests'
import databaseService from './database.services'
import VoucherPublic from '~/models/schemas/voucherPublic.schemas'
import { ObjectId } from 'mongodb'
import { notificationRealtime } from '~/utils/realtime.utils'
import User from '~/models/schemas/users.schemas'
import { VoucherPublicStatusEnum } from '~/constants/voucher.constants'

class VoucherPublicService {
  async create(payload: CreateVoucherRequestsBody, user: User) {
    const voucher_id = new ObjectId()
    const voucher = new VoucherPublic({
      _id: voucher_id,
      code: payload.code,
      discount: payload.discount,
      quantity: payload.quantity,
      expiration_date: new Date(payload.expiration_date),
      requirement: payload.requirement,
      created_by: user._id,
      updated_by: user._id
    })

    await Promise.all([
      databaseService.voucherPublic.insertOne(voucher),
      notificationRealtime('freshSync', 'create-public-voucher', 'voucher/public/create', voucher)
    ])
  }
  async update(payload: UpdateVoucherRequestsBody, user: User) {
    const voucher_id = new ObjectId(payload.voucher_id)
    const voucher = {
      _id: voucher_id,
      code: payload.code,
      discount: payload.discount,
      quantity: payload.quantity,
      expiration_date: new Date(payload.expiration_date),
      requirement: payload.requirement,
      updated_by: user._id
    }

    await Promise.all([
      databaseService.voucherPublic.updateOne(
        {
          _id: voucher_id
        },
        {
          $set: {
            code: payload.code,
            quantity: payload.quantity,
            discount: payload.discount,
            requirement: payload.requirement,
            expiration_date: new Date(payload.expiration_date),
            updated_by: user._id
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      notificationRealtime('freshSync', 'update-public-voucher', 'voucher/public/update', voucher)
    ])

    const promisesUser = [] as Promise<void>[]
    const users = await databaseService.users.find({ storage_voucher: { $in: [voucher_id] } }).toArray()

    const voucher_public = await databaseService.voucherPublic.findOne({ _id: voucher_id })

    for (const user of users) {
      promisesUser.push(
        new Promise((resolve, reject) => {
          try {
            notificationRealtime(`freshSync-user-${user._id}`, 'update-public-voucher-storage', `voucher/public/${user._id}/update`, voucher_public)
            resolve()
          } catch (err) {
            reject()
          }
        })
      )
    }

    await Promise.all(promisesUser)
  }
  async delete(payload: DeleteVoucherRequestsBody) {
    const data = {
      _id: new ObjectId(payload.voucher_id)
    }

    const promisesUser = [] as Promise<void>[]
    const users = await databaseService.users.find({ storage_voucher: { $in: [new ObjectId(payload.voucher_id)] } }).toArray()

    for (const user of users) {
      promisesUser.push(
        new Promise((resolve, reject) => {
          try {
            notificationRealtime(`freshSync-user-${user._id}`, 'delete-public-voucher-storage', `voucher/public/${user._id}/delete`, data)
            resolve()
          } catch (err) {
            reject()
          }
        })
      )
    }

    await Promise.all([
      ...promisesUser,
      databaseService.users.updateMany(
        {
          _id: new ObjectId(payload.voucher_id)
        },
        {
          $pull: {
            'storage_voucher': new ObjectId(payload.voucher_id)
          }
        }
      ),
      databaseService.voucherPublic.deleteOne({
        _id: new ObjectId(payload.voucher_id)
      }),
      notificationRealtime('freshSync', 'delete-public-voucher', 'voucher/public/delete', data)
    ])
  }
  async getVoucher() {
    const now = new Date()
    const voucher = await databaseService.voucherPublic.find({
      status: VoucherPublicStatusEnum.AVAILABLE,
      expiration_date: { $gt: now }
    }).toArray()
    return voucher
  }
  async useVoucher(voucher: VoucherPublic) {
    const used = voucher.quantity - 1
    const data = {
      ...voucher,
      _id: voucher._id,
      quantity: used,
      used: voucher.used + 1
    }

    if (used < 1) {
      const promisesUser = [] as Promise<void>[]
      const users = await databaseService.users.find({ storage_voucher: { $in: [voucher._id] } }).toArray()

      for (const user of users) {
        promisesUser.push(
          new Promise((resolve, reject) => {
            try {
              notificationRealtime(`freshSync-user-${user._id}`, 'expired-public-voucher-storage', `voucher/public/${user._id}/expired`, data)
              resolve()
            } catch (err) {
              reject()
            }
          })
        )
      }

      await Promise.all([
        databaseService.voucherPublic.updateOne(
          {
            _id: voucher._id
          },
          {
            $set: {
              status: VoucherPublicStatusEnum.UNAVAILABLE
            },
            $currentDate: {
              updated_at: true
            }
          }
        ),
        ...promisesUser
      ])
    }

    await Promise.all([
      databaseService.voucherPublic.updateOne(
        {
          _id: voucher._id
        },
        {
          $set: {
            quantity: used,
            used: voucher.used + 1
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      notificationRealtime('freshSync', 'update-public-voucher', 'voucher/public/update', data)
    ])
  }
  async storageVoucher(voucher_id: string, user: User) {
    const data = await databaseService.voucherPublic.findOne({ _id: new ObjectId(voucher_id) })

    await Promise.all([
      databaseService.users.updateOne(
        {
          _id: user._id
        },
        {
          $push: {
            'storage_voucher': new ObjectId(voucher_id)
          }
        }
      ),
      databaseService.voucherPublic.updateOne(
        {
          _id: new ObjectId(voucher_id)
        },
        {
          $inc: {
            storage: 1
          }
        }
      )
    ]),
    notificationRealtime(`freshSync-user-${user._id}`, 'create-public-voucher-storage', 'voucher/public/create', data)
  }
}

const voucherPublicService = new VoucherPublicService()
export default voucherPublicService
