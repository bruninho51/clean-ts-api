import { AccountModel } from '../../../domain/models/account'
import { AuthenticateModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccount()
      return account
    }
  }
  const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()

  return loadAccountByEmailRepository
}

const makeFakeAuthentication = (): AuthenticateModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepository: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepository)
  return {
    sut,
    loadAccountByEmailRepository
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenLastCalledWith('any_email@mail.com')
  })
  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe(null)
  })
})
