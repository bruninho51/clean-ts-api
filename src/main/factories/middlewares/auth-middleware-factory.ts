import { Middleware } from '@/presentations/protocols'
import { AuthMiddleware } from '@/presentations/middlewares/auth-middleware'
import { makeDbLoadAccountByToken } from '@/main/factories/usecases/account/load-account-by-token/db-load-account-by-token-factory'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
