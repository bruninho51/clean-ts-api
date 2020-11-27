import { badRequest, serverError, unauthorized, ok } from '../../../helpers/http/http-helper'
import { Validation } from '../../../../validation/validators'
import { Controller, Authentication, HttpRequest, HttpResponse } from './login-controller-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validator: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      console.error(error.stack)
      return serverError(error)
    }
  }
}
