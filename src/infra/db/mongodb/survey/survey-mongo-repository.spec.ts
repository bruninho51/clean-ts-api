import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import mockDate from 'mockdate'

let surveyCollection: Collection
interface SutTypes {
  sut: SurveyMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new SurveyMongoRepository()
  return {
    sut
  }
}

const insertSurveys = async (): Promise<void> => {
  await surveyCollection.insertMany([{
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }, {
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }])
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
  })

  describe('add()', () => {
    test('Should return an survey on add success', async () => {
      const { sut } = makeSut()
      await sut.add({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'other_answer'
        }],
        date: new Date()
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })
  describe('loadAll()', () => {
    test('Should loadAll surveys on success', async () => {
      await insertSurveys()
      const { sut } = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })
    test('Should load empty list', async () => {
      const { sut } = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      })
      const id = res.ops[0]._id
      const { sut } = makeSut()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
    test('Should load empty list', async () => {
      const { sut } = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
})
