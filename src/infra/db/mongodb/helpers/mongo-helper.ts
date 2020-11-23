import { Collection, MongoClient } from 'mongodb'

export class MongoHelper {
  private client: MongoClient

  private constructor () {}

  public static readonly instance: MongoHelper = new MongoHelper()

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  async disconnect (): Promise<void> {
    await this.client.close()
  }

  async getCollection (name: string): Promise<Collection> {
    return this.client.db().collection(name)
  }

  map = (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id })
  }
}
