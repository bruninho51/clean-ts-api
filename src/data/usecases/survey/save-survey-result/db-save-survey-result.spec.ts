import { SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'
import mockDate from 'mockdate'
import { throwError, mockSurveyResultModel, mockSurveyResultParams } from '@/domain/test'
import { mockSaveSurveyResultRepository } from '@/data/test'

interface SutTypes {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })
  afterAll(() => {
    mockDate.reset()
  })
  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(mockSurveyResultParams())
    expect(saveSpy).toHaveBeenCalledWith(mockSurveyResultParams())
  })
  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
    const promise = sut.save(mockSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(mockSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
