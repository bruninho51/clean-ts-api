import { makeLoginController } from './login-factory'
import { LoginController } from '../../../presentations/controllers/login/login-controller'

jest.mock('../../../presentations/controllers/login/login-controller')

describe('Login Factory', () => {
  test('Should call LoginController with all dependencies', () => {
    makeLoginController()
    expect(LoginController).toHaveBeenCalledWith(
      expect.any(Object), expect.any(Object))
  })
})
