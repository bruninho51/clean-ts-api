import { HttpResponse, HttpRequest, Controller, AddAccount, Validation } from './signup-controller-protocols'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { Authentication } from '../../../domain/usecases/authentication'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = httpRequest.body

      const error: Error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      const accessToken = await this.authentication.auth({ email: email, password: password })

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
