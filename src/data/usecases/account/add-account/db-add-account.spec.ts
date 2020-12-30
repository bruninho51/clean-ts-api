import {
  AddAccount,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test'
import { HasherSpy, mockAddAccountRepository, mockLoadAccountByEmailRepository } from '@/data/test'

interface SutTypes {
  sut: AddAccount
  hasherSpy: HasherSpy
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepository: LoadAccountByEmailRepository

}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepository = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockReturnValue(Promise.resolve(null))
  const sut = new DbAddAccount(hasherSpy, addAccountRepositoryStub, loadAccountByEmailRepository)

  return {
    hasherSpy: hasherSpy,
    addAccountRepositoryStub,
    loadAccountByEmailRepository,
    sut
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { hasherSpy, sut } = makeSut()
    const accountData = mockAddAccountParams()
    await sut.add(accountData)
    expect(hasherSpy.value).toBe('any_password') // exemplo de spy sem o jest
  })
  test('Should throw if Hasher throws', async () => {
    const { hasherSpy, sut } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const accountData = mockAddAccountParams()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
  test('Should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = mockAddAccountParams()
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
  test('Should throw if AddAccountRepository throws', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)
    const accountData = mockAddAccountParams()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = mockAddAccountParams()
    const account = await sut.add(accountData)
    expect(account).toEqual(mockAccountModel())
  })
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')
    await sut.add(mockAddAccountParams())
    expect(loadSpy).toHaveBeenLastCalledWith('any_email@mail.com')
  })
  test('Should return null if email exists', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()))
    const account = await sut.add(mockAddAccountParams())
    expect(account).toBeNull()
  })
})
