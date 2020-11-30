import { LoadSurveysController, SurveyModel, LoadSurveys } from './load-surveys-controller-protocols'
import mockDate from 'mockdate'

const makeFakeSurveys = (): SurveyModel[] => {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }, {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }]
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => [
    mockDate.set(new Date())
  ])
  afterAll(() => {
    mockDate.reset()
  })
  test('Should call LoadSurveys', async () => {
    class LoadSurveysStub implements LoadSurveys {
      async load (): Promise<SurveyModel[]> {
        return makeFakeSurveys()
      }
    }
    const loadSurveysStub = new LoadSurveysStub()
    const sut = new LoadSurveysController(loadSurveysStub)
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
