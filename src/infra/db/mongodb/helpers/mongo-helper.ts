import { MongoClient } from 'mongodb'

export class MongoHelper {
  private client: MongoClient

  private constructor () {}

  public static readonly instance: MongoHelper = new MongoHelper()

  async connect (uri: string): Promise<void> {
    if (this.client) {
      this.client = await MongoClient.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }
  }

  async disconnect (): Promise<void> {
    await this.client.close()
  }

  getDb (): MongoClient {
    return this.client
  }
}
