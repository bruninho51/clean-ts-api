import { DbAuthentication } from '../../../../../data/usecases/authentication/db-authentication'
import { makeDbAuthentication } from './db-authentication-factory'

jest.mock('../../../../../data/usecases/authentication/db-authentication')

describe('DbAuthentication Factory', () => {
  test('Should call DbAuthentication with all dependencies', () => {
    makeDbAuthentication()
    expect(DbAuthentication).toHaveBeenCalledWith(
      expect.any(Object), expect.any(Object), expect.any(Object), expect.any(Object))
  })
})
