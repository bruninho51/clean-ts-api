import { Controller, HttpResponse, Validation, AddSurvey } from './add-survey-controller-protocols'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller<AddSurveyControllerRequest> {
  constructor (
    private readonly validator: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (request: AddSurveyControllerRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request)
      if (error) {
        return badRequest(error)
      }

      const { question, answers } = request
      await this.addSurvey.add({
        question: question,
        answers: answers,
        date: new Date()
      })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export type AddSurveyControllerRequest = {
  question: string
  answers: Answer[]
}

type Answer = {
  image?: string
  answer: string
}
