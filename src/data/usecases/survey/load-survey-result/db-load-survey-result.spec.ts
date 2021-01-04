import { makeLoadSurveyResultRepository, mockLoadSurveyByIdRepository } from '@/data/test'
import { mockSurveyResultModelEmpty, throwError } from '@/domain/test'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from './db-load-survey-result-protocols'
import mockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })
  afterAll(() => {
    mockDate.reset()
  })
  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.load('any_survey_id', 'any_account_id')
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id', 'any_account_id')
  })
  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.load('any_survey_id', 'any_account_id')
    await expect(promise).rejects.toThrow()
  })
  test('Should return SurveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResultModel = await sut.load('any_survey_id', 'any_account_id')
    expect(surveyResultModel.surveyId).toBe('any_survey_id')
  })
  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.load('any_survey_id', 'any_account_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
  test('Should return SurveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const surveyResultModel = await sut.load('any_survey_id', 'any_account_id')
    expect(surveyResultModel).toEqual(mockSurveyResultModelEmpty())
  })
})
