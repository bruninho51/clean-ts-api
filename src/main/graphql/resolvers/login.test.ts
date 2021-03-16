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
  describe('SignUp Mutation', () => {
    const signUpMutation = gql`
      mutation signUp ($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
        signUp (name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
          accessToken
          name
        }
      }
    `
    test('Should return an Account on valid data', async () => {
      const fakeUser = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(signUpMutation, {
        variables: {
          name: fakeUser.name,
          email: fakeUser.email,
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      })
      expect(res.data.signUp.accessToken).toBeTruthy()
      expect(res.data.signUp.name).toBe(fakeUser.name)
    })

    test('Should return EmailInUseError on invalid data', async () => {
      const fakeUser = {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: await hash('any_password', 12)
      }
      await accountCollection.insertOne(fakeUser)
      const { mutate } = createTestClient({ apolloServer })
      const res: any = await mutate(signUpMutation, {
        variables: {
          name: fakeUser.name,
          email: fakeUser.email,
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('The received email is already in use')
    })
  })
})
