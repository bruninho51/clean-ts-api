import { adaptResolver } from '@/main/adapters/apollo-server-resolve-adapter'
import { makeLoginController } from '@/main/factories/controllers/login/login/login-factory'
import { makeSignUpController } from '@/main/factories/controllers/login/signup/signup-factory'

export default {
  Query: {
    login: async (parent: any, args: any): Promise<any> => await adaptResolver(makeLoginController(), args)
  },
  Mutation: {
    signUp: async (parent: any, args: any): Promise<any> => await adaptResolver(makeSignUpController(), args)
  }
}
