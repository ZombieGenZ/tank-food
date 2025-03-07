import { Db, MongoClient, Collection } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/users.schemas'
import Log from '~/models/schemas/logs.schemas'
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
      console.log(`\x1b[33mĐã kết nối thành công đến cơ sở dử liệu \x1b[36m${process.env.DATABASE_NAME}\x1b[0m`)
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DATABASE_USER_COLLECTION as string)
  }
  get logs(): Collection<Log> {
    return this.db.collection(process.env.DATABASE_LOG_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
