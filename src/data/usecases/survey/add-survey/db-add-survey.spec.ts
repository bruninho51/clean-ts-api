import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepository } from './db-add-survey-protocols'
import mockDate from 'mockdate'
import { throwError } from '@/domain/test'
import { mockAddSurveyRepository, mockSurveyParams } from '@/data/test'

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })
  afterAll(() => {
    mockDate.reset()
  })
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(mockSurveyParams())
    expect(addSpy).toHaveBeenCalledWith(mockSurveyParams())
  })
  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError)
    const surveyData = mockSurveyParams()
    const promise = sut.add(surveyData)
    await expect(promise).rejects.toThrow()
  })
})
