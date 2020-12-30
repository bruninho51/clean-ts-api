import { AuthenticationModel } from '@/domain/models/authentication'

export interface AuthenticateParams {
  email: string
  password: string
}
export interface Authentication {
  auth: (Authentication: AuthenticateParams) => Promise<AuthenticationModel>
}
