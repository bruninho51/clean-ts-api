import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return await new Promise(resolve => resolve(mockAccountModel()))
    }
  }

  const addAccountRepositoryStub = new AddAccountRepositoryStub()

  return addAccountRepositoryStub
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      const account: AccountModel = mockAccountModel()
      return account
    }
  }
  const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()

  return loadAccountByEmailRepository
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return mockAccountModel()
    }
  }
  const loadAccountByTokenRepositoryStub = new LoadAccountByTokenRepositoryStub()
  return loadAccountByTokenRepositoryStub
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return mockAccountModel()
    }
  }
  return new LoadAccountByTokenStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepository implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {}
  }

  return new UpdateAccessTokenRepository()
}
