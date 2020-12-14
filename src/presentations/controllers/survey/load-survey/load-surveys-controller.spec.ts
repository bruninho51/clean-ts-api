import { LoadSurveysController, LoadSurveys } from './load-surveys-controller-protocols'
import mockDate from 'mockdate'
import { noContent, ok, serverError } from '../../../helpers/http/http-helper'
import { throwError } from '@/domain/test'
import { mockLoadSurveys } from '@/presentations/test'
import { mockSurveyModels } from '@/data/test'

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys

}

const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => [
    mockDate.set(new Date())
  ])
  afterAll(() => {
    mockDate.reset()
  })
  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(mockSurveyModels()))
  })
  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)
    const httpRequest = await sut.handle({})
    expect(httpRequest).toEqual(serverError(new Error()))
  })
  test('Should return 204 if LoadSurveys return empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })
})
