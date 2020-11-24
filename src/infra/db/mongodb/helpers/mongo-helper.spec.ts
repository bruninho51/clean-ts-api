import { MongoHelper } from './mongo-helper'

const sut = MongoHelper.instance

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await sut.disconnect()
  })
  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = sut.getCollection('accounts')
    await expect(accountCollection).resolves.toBeTruthy()
    await sut.disconnect()
    accountCollection = sut.getCollection('accounts')

    await expect(accountCollection).resolves.toBeTruthy()
  })
})
