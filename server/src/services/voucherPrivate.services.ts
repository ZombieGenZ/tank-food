import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import VoucherPrivate from '~/models/schemas/voucherPrivate.schemas'
import User from '~/models/schemas/users.schemas'
import { notificationRealtime } from '~/utils/realtime.utils'
import { VoucherPrivateStatusEnum } from '~/constants/voucher.constants'

class VoucherPrivateService {
  async getVoucher(user: User) {
    const [voucher_public, voucher_private] = await Promise.all([
      databaseService.users.aggregate([
        {
          $match: {
            _id: user._id,
          }
        },
        {
          $lookup: {
            from: process.env.DATABASE_VOUCHER_PUBLIC_COLLECTION,
            localField: 'storage_voucher',
            foreignField: '_id',
            as: 'voucher_public',
          }
        },
        {
          $unwind: {
            path: '$voucher_public'
          }
        },
        {
          $replaceRoot: {
            newRoot: '$voucher_public'
          }
        }
      ]).toArray(),
      await databaseService.voucherPrivate
      .find({
        user: user._id
      })
      .toArray()
    ])
    
    return {
      voucher_public,
      voucher_private
    }
  }
  async insertVoucher(code: string, discount: number, user: ObjectId) {
    const voucher_id = new ObjectId()
    const voucher = new VoucherPrivate({
      _id: voucher_id,
      code,
      discount,
      user
    })
    await Promise.all([
      databaseService.voucherPrivate.insertOne(voucher),
      notificationRealtime(`freshSync-user-${user}`, 'new-voucher-private', 'voucher/private/new', voucher)
    ])
  }
  async useVoucher(voucher: VoucherPrivate) {
    const data = {
      ...voucher,
      _id: voucher._id
    }
    await Promise.all([
      databaseService.voucherPrivate.updateOne(
        {
          _id: voucher._id
        },
        {
          $set: {
            status: VoucherPrivateStatusEnum.USED
          },
          $currentDate: {
            updated_at: true
          }
        }
      ),
      notificationRealtime(`freshSync-user-${voucher.user}`, 'use-voucher-private', 'voucher/private/remove', data)
    ])
  }
}

const voucherPrivateService = new VoucherPrivateService()
export default voucherPrivateService
