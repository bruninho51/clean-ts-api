import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware', () => {
  test('Should return 403 if no-access-token exists in headers', async () => {
    const sut = new AuthMiddleware()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
