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

describe('Survey Result GraphQL', () => {
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
  describe('SurveyResult Query', () => {
    const surveyResultQuery = gql`
        query surveyResult ($surveyId: String!) {
          surveyResult (surveyId: $surveyId) {
            question
            answers {
              answer
              count
              percent
              isCurrentAccountAnswer
            }
            date
          }
        }
    `
    test('Should return SurveyResult', async () => {
      const accessToken = await makeAccessToken()
      const surveyModel = makeFakeSurveyData()
      const surveyResult = await surveyCollection.insertOne(surveyModel)
      const surveyId = surveyResult.ops[0]._id
      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: surveyId.toString()
        }
      })
      expect(res.data.surveyResult.question).toBe(surveyModel.question)
      expect(res.data.surveyResult.date).toBeTruthy()
      expect(res.data.surveyResult.answers).toEqual([{
        answer: surveyModel.answers[0].answer,
        count: 0,
        isCurrentAccountAnswer: false,
        percent: 0
      }])
    })
    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyModel = makeFakeSurveyData()
      const surveyResult = await surveyCollection.insertOne(surveyModel)
      const surveyId = surveyResult.ops[0]._id
      const { query } = createTestClient({
        apolloServer
      })
      const res: any = await query(surveyResultQuery, {
        variables: {
          surveyId: surveyId.toString()
        }
      })
      expect(res.data.surveyResult).toBeFalsy()
      expect(res.errors[0].message).toBe('Access Denied')
    })
  })
  describe('SaveSurveyResult Query', () => {
    const surveyResultMutation = gql`
      mutation saveSurveyResult ($surveyId: String!, $answer: String!) {
        saveSurveyResult (surveyId: $surveyId, answer: $answer) {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `
    test('Should return SurveyResult', async () => {
      const accessToken = await makeAccessToken()
      const surveyModel = makeFakeSurveyData()
      const surveyResult = await surveyCollection.insertOne(surveyModel)
      const surveyId = surveyResult.ops[0]._id
      const { mutate } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await mutate(surveyResultMutation, {
        variables: {
          surveyId: surveyId.toString(),
          answer: surveyModel.answers[0].answer
        }
      })
      expect(res.data.saveSurveyResult.question).toBe(surveyModel.question)
      expect(res.data.saveSurveyResult.date).toBeTruthy()
      expect(res.data.saveSurveyResult.answers).toEqual([{
        answer: surveyModel.answers[0].answer,
        count: 1,
        isCurrentAccountAnswer: true,
        percent: 100
      }])
    })
  })
})
