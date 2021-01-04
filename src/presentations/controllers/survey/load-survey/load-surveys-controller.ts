import { noContent, ok, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller<LoadSurveysControllerRequest> {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (request: LoadSurveysControllerRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId)
      return surveys.length > 0 ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export type LoadSurveysControllerRequest = {
  accountId: string
}
