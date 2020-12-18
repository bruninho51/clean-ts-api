import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { AuthenticateParams, Authentication } from '@/domain/usecases/account/authentication'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return mockAccountModel()
    }
  }

  return new AddAccountStub()
}

export const mockAuthenticate = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (Authentication: AuthenticateParams): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}
