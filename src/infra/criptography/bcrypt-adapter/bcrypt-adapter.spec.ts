import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
import { throwError } from '@/domain/test'

interface SutTypes {
  sut: BcryptAdapter
  salt: number
}

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashed_value')
  },
  async compare (value: string, hash: string): Promise<boolean> {
    return await Promise.resolve(true)
  }
}))

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return {
    sut,
    salt
  }
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const { sut, salt } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })
    test('Should return a valid hash on hash success', async () => {
      const { sut } = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hashed_value')
    })
    test('Should throw if hash throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError)
      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })
    test('Should return true when compare success', async () => {
      const { sut } = makeSut()
      const compare = await sut.compare('any_value', 'any_hash')
      expect(compare).toBe(true)
    })
    test('Should return false when compare fails', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false))
      const compare = await sut.compare('any_value', 'any_hash')
      expect(compare).toBe(false)
    })
    test('Should throw if compare throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError)
      const promise = sut.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
