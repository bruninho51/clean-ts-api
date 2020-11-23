import { Collection, MongoClient } from 'mongodb'

export class MongoHelper {
  private client: MongoClient

  private constructor () {}

  public static readonly instance: MongoHelper = new MongoHelper()

  async connect (uri: string): Promise<void> {
    if (!this.client) {
      this.client = await MongoClient.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }
  }

  async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.close()
    }
  }

  async getCollection (name: string): Promise<Collection> {
    await this.connect('')
    return this.client.db().collection(name)
  }
}
