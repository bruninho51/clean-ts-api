import { makeSignUpController } from './signup-factory'
import { SignUpController } from '../../../../../presentations/controllers/login/signup/signup-controller'

jest.mock('../../../../../presentations/controllers/login/signup/signup-controller')

describe('SignUp Factory', () => {
  test('Should call SignUpController with all dependencies', () => {
    makeSignUpController()
    expect(SignUpController).toHaveBeenCalledWith(
      expect.any(Object), expect.any(Object), expect.any(Object))
  })
})
