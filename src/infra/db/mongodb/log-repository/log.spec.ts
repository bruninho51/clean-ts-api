import { Collection } from 'mongodb'
import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

const makeSut = (): LogErrorRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.instance.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.instance.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.instance.getCollection('errors')
    await errorCollection.deleteMany({})
  })
  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})