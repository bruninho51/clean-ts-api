
export interface AuthenticateParams {
  email: string
  password: string
}
export interface Authentication {
  auth: (Authentication: AuthenticateParams) => Promise<string>
}
