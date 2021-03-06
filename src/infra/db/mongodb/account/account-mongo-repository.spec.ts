import { mockAddAccountParams } from '@/domain/test'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection
interface SutTypes {
  sut: AccountMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new AccountMongoRepository()
  return {
    sut
  }
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.instance.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.instance.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.instance.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const { sut } = makeSut()
      const account = await sut.add(mockAddAccountParams())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
  })
  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const { sut } = makeSut()
      await accountCollection.insertOne(mockAddAccountParams())
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
    test('Should return null if loadByEmail fails', async () => {
      const { sut } = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeNull()
    })
  })
  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const { sut } = makeSut()
      const result = await accountCollection.insertOne(mockAddAccountParams())
      const fakeAccount = result.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy()
      await sut.updateAccessToken(fakeAccount._id, 'any_token')
      const account = await accountCollection.findOne({ _id: result.ops[0]._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })
  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const { sut } = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
    test('Should return an account on loadByToken with admin role', async () => {
      const { sut } = makeSut()
      await accountCollection.insertMany([{
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      },
      {
        name: 'another_name',
        email: 'another_email@mail.com',
        password: 'another_password',
        accessToken: 'any_token',
        role: 'admin'
      }])
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('another_name')
      expect(account.email).toBe('another_email@mail.com')
      expect(account.password).toBe('another_password')
    })
    test('Should return an account on loadByToken if user is admin', async () => {
      const { sut } = makeSut()
      await accountCollection.insertMany([{
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      }])
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })
    test('Should return null on loadByToken with invalid role', async () => {
      const { sut } = makeSut()
      await accountCollection.insertMany([{
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      },
      {
        name: 'another_name',
        email: 'another_email@mail.com',
        password: 'another_password',
        accessToken: 'any_token'
      }])
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeNull()
    })
    test('Should return null if loadByToken fails', async () => {
      const { sut } = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeNull()
    })
  })
})
