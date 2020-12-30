import { AddAccountParams } from '@/presentations/controllers/login/signup/signup-controller-protocols'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeFakeAccount = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne(makeFakeAccount())
  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

describe('PUT /surveys/:surveyId/results', () => {
  beforeAll(async () => {
    await MongoHelper.instance.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.instance.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.instance.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.instance.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  test('Should return 403 on save survey result without accessToken', async () => {
    await request(app)
      .put('/api/surveys/any_id/results')
      .send({
        answer: 'any_answer'
      })
      .expect(403)
  })
  test('Should return 200 on save survey result with accessToken', async () => {
    const accessToken = await makeAccessToken()
    const res = await surveyCollection.insertOne({
      question: 'Question',
      answers: [{
        answer: 'Answer 1',
        image: 'any_image'
      }],
      date: new Date()
    })
    const id: string = res.ops[0]._id
    await request(app)
      .put(`/api/surveys/${id}/results`)
      .set('x-access-token', accessToken)
      .send({
        answer: 'Answer 1'
      })
      .expect(200)
  })
})

describe('GET /surveys/:surveyId/results', () => {
  beforeAll(async () => {
    await MongoHelper.instance.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.instance.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.instance.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.instance.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  test('Should return 403 on load survey result without accessToken', async () => {
    await request(app)
      .get('/api/surveys/any_id/results')
      .send({
        answer: 'any_answer'
      })
      .expect(403)
  })
})
