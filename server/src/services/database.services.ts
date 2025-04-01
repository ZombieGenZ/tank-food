import { Db, MongoClient, Collection, IndexSpecification, CreateIndexesOptions } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/users.schemas'
import RefreshToken from '~/models/schemas/refreshtoken.schemas'
import Log from '~/models/schemas/logs.schemas'
import { LANGUAGE } from '~/constants/language.constants'
import { serverLanguage } from '~/index'
import Category from '~/models/schemas/categories.schemas'
import Prompt from '~/models/schemas/prompt.schemas'
import Product from '~/models/schemas/product.schemas'
import VoucherPublic from '~/models/schemas/voucherPublic.schemas'
import VoucherPrivate from '~/models/schemas/voucherPrivate.schemas'
import Order from '~/models/schemas/orders.schemas'
import PaymentHistory from '~/models/schemas/paymentHistory.schemas'
import Contact from '~/models/schemas/contact.shemas'
import BackupLog from '~/models/schemas/backup_logs.shemas'

dotenv.config()

const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@tank-food.l2yv7.mongodb.net/?retryWrites=true&w=majority&appName=TANK-Food`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DATABASE_NAME)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      await this.initializeCollectionsAndIndexes()

      if (serverLanguage == LANGUAGE.VIETNAMESE) {
        console.log(`\x1b[33mĐã kết nối thành công đến cơ sở dữ liệu \x1b[36m${process.env.DATABASE_NAME}\x1b[0m`)
      } else {
        console.log(`\x1b[33mSuccessfully connected to database \x1b[36m${process.env.DATABASE_NAME}\x1b[0m`)
      }
    } catch (err) {
      if (serverLanguage == LANGUAGE.VIETNAMESE) {
        console.error('\x1b[31mLỗi kết nối đến cơ sở dữ liệu:\x1b[33m', err)
        console.log('\x1b[0m')
      } else {
        console.error('\x1b[31mError connecting to database:\x1b[33m', err)
        console.log('\x1b[0m')
      }
      throw err
    }
  }

  private async initializeCollectionsAndIndexes() {
    const collections = await this.db.listCollections().toArray()
    const collectionNames = collections.map((col) => col.name)

    interface IndexConfig {
      key: IndexSpecification
      options: CreateIndexesOptions
    }

    interface CollectionConfig {
      name: string
      indexes: IndexConfig[]
    }

    const collectionConfigs: CollectionConfig[] = [
      {
        name: process.env.DATABASE_USER_COLLECTION as string,
        indexes: [
          { key: { email: 1 }, options: { name: 'email_1', unique: true } },
          { key: { phone: 1 }, options: { name: 'phone_1', unique: true } }
        ]
      },
      {
        name: process.env.DATABASE_REFRESH_TOKEN_COLLECTION as string,
        indexes: [{ key: { token: 1 }, options: { name: 'token_1', unique: true } }]
      },
      {
        name: process.env.DATABASE_VOUCHER_PUBLIC_COLLECTION as string,
        indexes: [{ key: { code: 1 }, options: { name: 'code_1', unique: true } }]
      },
      {
        name: process.env.DATABASE_ORDER_COLLECTION as string,
        indexes: [{ key: { user: 1 }, options: { name: 'user_1' } }]
      },
      {
        name: process.env.DATABASE_BACKUP_LOG_COLLECTION as string,
        indexes: [{ key: { file_id: 1 }, options: { name: 'file_id_1' } }]
      },
      { name: process.env.DATABASE_CATEGORY_COLLECTION as string, indexes: [] },
      { name: process.env.DATABASE_PRODUCT_COLLECTION as string, indexes: [] },
      { name: process.env.DATABASE_VOUCHER_PRIVATE_COLLECTION as string, indexes: [] },
      { name: process.env.DATABASE_CONTACT_COLLECTION as string, indexes: [] },
      { name: process.env.DATABASE_PAYMENT_HISTORY_COLLECTION as string, indexes: [] },
      { name: process.env.DATABASE_PROMPT_COLLECTION as string, indexes: [] },
      { name: process.env.DATABASE_LOG_COLLECTION as string, indexes: [] }
    ]

    for (const config of collectionConfigs) {
      if (!collectionNames.includes(config.name)) {
        await this.db.createCollection(config.name)
        if (serverLanguage === LANGUAGE.VIETNAMESE) {
          console.log(`\x1b[33mĐã tạo collection: ${config.name}\x1b[0m`)
        } else {
          console.log(`\x1b[33mCreated collection: ${config.name}\x1b[0m`)
        }
      }

      const collection = this.db.collection(config.name)
      const existingIndexes = await collection.listIndexes().toArray()
      const existingIndexNames = existingIndexes.map((index) => index.name)

      for (const index of config.indexes) {
        if (!existingIndexNames.includes(index.options.name)) {
          try {
            await collection.createIndex(index.key, index.options)
            if (serverLanguage === LANGUAGE.VIETNAMESE) {
              console.log(`\x1b[33mĐã tạo index ${index.options.name} cho ${config.name}\x1b[0m`)
            } else {
              console.log(`\x1b[33mCreated index ${index.options.name} on ${config.name}\x1b[0m`)
            }
          } catch (error: any) {
            if (serverLanguage === LANGUAGE.VIETNAMESE) {
              console.log(
                `\x1b[31mLỗi khi tạo index ${index.options.name} cho ${config.name}:\x1b[33m`,
                (error as Error).message,
                `\x1b[0m`
              )
            } else {
              console.log(
                `\x1b[31mError creating index ${index.options.name} on ${config.name}:\x1b[33m`,
                (error as Error).message,
                `\x1b[0m`
              )
            }
          }
        }
      }
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DATABASE_USER_COLLECTION as string)
  }
  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DATABASE_REFRESH_TOKEN_COLLECTION as string)
  }
  get categories(): Collection<Category> {
    return this.db.collection(process.env.DATABASE_CATEGORY_COLLECTION as string)
  }
  get products(): Collection<Product> {
    return this.db.collection(process.env.DATABASE_PRODUCT_COLLECTION as string)
  }
  get voucherPublic(): Collection<VoucherPublic> {
    return this.db.collection(process.env.DATABASE_VOUCHER_PUBLIC_COLLECTION as string)
  }
  get voucherPrivate(): Collection<VoucherPrivate> {
    return this.db.collection(process.env.DATABASE_VOUCHER_PRIVATE_COLLECTION as string)
  }
  get order(): Collection<Order> {
    return this.db.collection(process.env.DATABASE_ORDER_COLLECTION as string)
  }
  get contact(): Collection<Contact> {
    return this.db.collection(process.env.DATABASE_CONTACT_COLLECTION as string)
  }
  get paymentHistory(): Collection<PaymentHistory> {
    return this.db.collection(process.env.DATABASE_PAYMENT_HISTORY_COLLECTION as string)
  }
  get prompt(): Collection<Prompt> {
    return this.db.collection(process.env.DATABASE_PROMPT_COLLECTION as string)
  }
  get logs(): Collection<Log> {
    return this.db.collection(process.env.DATABASE_LOG_COLLECTION as string)
  }
  get backupLog(): Collection<BackupLog> {
    return this.db.collection(process.env.DATABASE_BACKUP_LOG_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
