import { makeAddSurveyController } from './add-survey-controller-factory'
import { AddSurveyController } from '../../../../presentations/controllers/survey/add-survey/add-survey-controller'

jest.mock('../../../../presentations/controllers/survey/add-survey/add-survey-controller')

describe('AddSurvey Factory', () => {
  test('Should call AddSurveyController with all dependencies', () => {
    makeAddSurveyController()
    expect(AddSurveyController).toHaveBeenCalledWith(
      expect.any(Object), expect.any(Object))
  })
})
