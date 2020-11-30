import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository {
  load: (email: string) => Promise<AccountModel>
  private readonly mongo: MongoHelper = MongoHelper.instance

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await this.mongo.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return this.mongo.map(result.ops[0])
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await this.mongo.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    if (account) {
      return this.mongo.map(account)
    }

    return null
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await this.mongo.getCollection('accounts')
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken: token
      }
    })
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await this.mongo.getCollection('accounts')
    const account = await accountCollection.findOne({ accessToken: token, role })
    if (account) {
      return this.mongo.map(account)
    }

    return null
  }
}
