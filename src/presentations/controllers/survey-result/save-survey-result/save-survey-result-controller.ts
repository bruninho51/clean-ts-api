import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { InvalidParamError } from '@/presentations/errors'
import { forbidden, ok, serverError } from '@/presentations/helpers/http/http-helper'
import { LoadSurveyById, Controller, HttpResponse } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller<SaveSurveyResultControllerRequest> {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (request: SaveSurveyResultControllerRequest): Promise<HttpResponse> {
    try {
      const { surveyId, accountId, answer } = request

      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answers: string[] = survey.answers.map(a => a.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyResult = await this.saveSurveyResult.save({
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

export type SaveSurveyResultControllerRequest = {
  surveyId: string
  accountId: string
  answer: string
}
