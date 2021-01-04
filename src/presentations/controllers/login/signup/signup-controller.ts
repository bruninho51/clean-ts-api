import { HttpResponse, Controller, AddAccount, Validation } from './signup-controller-protocols'
import { badRequest, forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { Authentication } from '@/domain/usecases/account/authentication'
import { EmailInUseError } from '../../../errors'

export class SignUpController implements Controller<SignUpControllerRequest> {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (request: SignUpControllerRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = request

      const error: Error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const authenticationModel = await this.authentication.auth({ email: email, password: password })

      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export type SignUpControllerRequest = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}
