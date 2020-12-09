import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { InvalidParamError } from '@/presentations/errors'
import { forbidden, ok, serverError } from '@/presentations/helpers/http/http-helper'
import { LoadSurveyById, Controller, HttpRequest, HttpResponse } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyByIdStub: LoadSurveyById,
    private readonly saveSurveyResultStub: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { accountId } = httpRequest
      const { answer } = httpRequest.body
      const survey = await this.loadSurveyByIdStub.loadById(surveyId)
      if (survey) {
        const answers: string[] = survey.answers.map(a => a.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyResult = await this.saveSurveyResultStub.save({
        surveyId,
        accountId,
        date: new Date(),
        answer
      })

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
