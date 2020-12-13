import { Controller } from '@/presentations/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { LoadSurveysController } from '@/presentations/controllers/survey/load-survey/load-surveys-controller'
import { makeDbLoadSurveys } from '@/main/factories/usecases/survey/load-survey/db-load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}
