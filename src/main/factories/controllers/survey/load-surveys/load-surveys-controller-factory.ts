import { Controller } from '../../../../../presentations/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { LoadSurveysController } from '../../../../../presentations/controllers/survey/load-survey/load-surveys-controller'
import { makeDbLoadSurveys } from '../../../usecases/add-survey/db-load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}
