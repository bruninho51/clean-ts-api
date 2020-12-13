import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('PUT /surveys/:surveyId/results', () => {
  beforeAll(async () => {
    await MongoHelper.instance.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.instance.disconnect()
  })

  test('Should return 403 on save survey result without accessToken', async () => {
    await request(app)
      .put('/api/surveys/any_id/results')
      .send({
        answer: 'any_answer'
      })
      .expect(403)
  })
})
