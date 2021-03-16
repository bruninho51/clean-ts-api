import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { Collection } from 'mongodb'
import { createTestClient } from 'apollo-server-integration-testing'
import { ApolloServer, gql } from 'apollo-server-express'
import { makeApolloServer } from '@/main/graphql/resolvers/helpers'
import { mockAccountModel } from '@/domain/test'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let surveyCollection: Collection
let accountCollection: Collection
let apolloServer: ApolloServer

const makeFakeSurveyData = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAccountModel())
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

describe('Login GraphQL', () => {
  beforeAll(async () => {
    await MongoHelper.instance.connect(process.env.MONGO_URL)
    apolloServer = makeApolloServer()
  })

  afterAll(async () => {
    await MongoHelper.instance.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.instance.getCollection('surveys')
    accountCollection = await MongoHelper.instance.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })
  describe('Surveys Query', () => {
    const surveysQuery = gql`
        query surveys {
          surveys {
            id
            question
            answers {
              image
              answer
            }
            date
            didAnswer
          }
        }
    `
    test('Should return Surveys', async () => {
      const accessToken = await makeAccessToken()
      const surveyModel = makeFakeSurveyData()
      await surveyCollection.insertOne(surveyModel)
      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await query(surveysQuery)
      expect(res.data.surveys.length).toBe(1)
    })
  })
})
