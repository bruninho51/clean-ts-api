import { badRequest, serverError, unauthorized, ok } from '../../../helpers/http/http-helper'
import { Validation } from '@/validation/validators'
import { Controller, Authentication, HttpResponse } from './login-controller-protocols'

export class LoginController implements Controller<LoginControllerRequest> {
  constructor (
    private readonly authentication: Authentication,
    private readonly validator: Validation
  ) {}

  async handle (request: LoginControllerRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = request
      const authentication = await this.authentication.auth({ email, password })
      if (!authentication) {
        return unauthorized()
      }

      return ok({
        accessToken: authentication.accessToken,
        name: authentication.name
      })
    } catch (error) {
      console.error(error.stack)
      return serverError(error)
    }
  }
}

export type LoginControllerRequest = {
  email: string
  password: string
}
