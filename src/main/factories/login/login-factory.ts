import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { Controller } from '../../../presentations/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '../../../presentations/controllers/login/login-controller'
import { AuthenticateModel, Authentication } from '../../../domain/usecases/authentication'

const makeAuthenticateStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticateModel): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}

export const makeSignUpController = (): Controller => {
  const validationComposite = makeLoginValidation()
  const authenticator = makeAuthenticateStub()
  const loginController = new LoginController(authenticator, validationComposite)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
