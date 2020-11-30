import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let surveyCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.instance.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.instance.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.instance.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on try add survey without token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question 1',
          answers: [{
            image: 'any_image',
            answer: 'Answer 1'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })
  })
})
