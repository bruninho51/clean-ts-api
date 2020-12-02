import { Collection, MongoClient } from 'mongodb'

export class MongoHelper {
  private client: MongoClient
  private uri: string

  private constructor () {}

  public static readonly instance: MongoHelper = new MongoHelper()

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  }

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  }

  map = (data: any): any => {
    const { _id, ...collectionWithoutId } = data
    return Object.assign({}, collectionWithoutId, { id: _id })
  }

  mapCollection = (collection: any[]): any[] => {
    return collection.map(data => MongoHelper.instance.map(data))
  }
}
