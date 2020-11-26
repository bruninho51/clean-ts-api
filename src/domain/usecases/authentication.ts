
export interface AuthenticateModel {
  email: string
  password: string
}
export interface Authentication {
  auth: (Authentication: AuthenticateModel) => Promise<string>
}
