import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validator.validate(httpRequest.body)
    return null
  }
}
