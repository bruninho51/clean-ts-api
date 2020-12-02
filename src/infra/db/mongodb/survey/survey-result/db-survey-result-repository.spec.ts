import { Collection } from 'mongodb'
import { MongoHelper } from '../../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './db-survey-result-repository'
import mockDate from 'mockdate'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultsCollection: Collection
let accountsCollection: Collection

interface SutTypes {
  sut: SurveyResultMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new SurveyResultMongoRepository()
  return {
    sut
  }
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }, {
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  })
  return res.ops[0]
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountsCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_pwd'
  })
  return res.ops[0]
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    mockDate.set(new Date())
    await MongoHelper.instance.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    mockDate.reset()
    await MongoHelper.instance.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.instance.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultsCollection = await MongoHelper.instance.getCollection('surveyResults')
    await surveyResultsCollection.deleteMany({})
    accountsCollection = await MongoHelper.instance.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const { sut } = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })
    test('Should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const res = await surveyResultsCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const { sut } = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(res.ops[0]._id)
      expect(surveyResult.answer).toBe(survey.answers[1].answer)
    })
  })
})
