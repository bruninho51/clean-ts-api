import { AccountModel } from '../models/account'

export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  async add: (account: AddAccountModel) => Promise<AccountModel>
}
