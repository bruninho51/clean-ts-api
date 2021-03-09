import { adaptResolver } from '@/main/adapters/apollo-server-resolve-adapter'
import { makeLoginController } from '@/main/factories/controllers/login/login/login-factory'

export default {
  Query: {
    login: async (parent: any, args: any): Promise<any> => await adaptResolver(makeLoginController(), args)
  }
}
