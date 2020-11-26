import { HttpResponse, HttpRequest, Controller, AddAccount, Validation } from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

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

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
