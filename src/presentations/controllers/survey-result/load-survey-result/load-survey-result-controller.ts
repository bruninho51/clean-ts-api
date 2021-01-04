
import { InvalidParamError } from '@/presentations/errors'
import { forbidden, ok, serverError } from '@/presentations/helpers/http/http-helper'
import { Controller, HttpResponse, LoadSurveyById, LoadSurveyResult } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller<LoadSurveyResultControllerRequest> {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (request: LoadSurveyResultControllerRequest): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export type LoadSurveyResultControllerRequest = {
  accountId: string
  surveyId: string
}
