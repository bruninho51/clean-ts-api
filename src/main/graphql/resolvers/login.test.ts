import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { createTestClient } from 'apollo-server-integration-testing'
import { ApolloServer, gql } from 'apollo-server-express'
import { makeApolloServer } from '@/main/graphql/resolvers/helpers'

let accountCollection: Collection
let apolloServer: ApolloServer

describe('Login GraphQL', () => {
  beforeAll(async () => {
    await MongoHelper.instance.connect(process.env.MONGO_URL)
    apolloServer = makeApolloServer()
  })

  afterAll(async () => {
    await MongoHelper.instance.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.instance.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('Login Query', () => {
    const loginQuery = gql`
        query login ($email: String!, $password: String!) {
          login (email: $email, password: $password) {
            accessToken
            name 
          }
        }
    `
    test('Should return an Account on valid credentials', async () => {
      const fakeUser = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: await hash('any_password', 12)
      }
      await accountCollection.insertOne(fakeUser)
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery, {
        variables: {
          email: fakeUser.email,
          password: 'any_password'
        }
      })
      expect(res.data.login.accessToken).toBeTruthy()
      expect(res.data.login.name).toBe(fakeUser.name)
    })

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const fakeUser = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: await hash('any_password', 12)
      }
      const { query } = createTestClient({ apolloServer })
      const res: any = await query(loginQuery, {
        variables: {
          email: fakeUser.email,
          password: 'any_password'
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Unauthorized Error')
    })
  })
})
