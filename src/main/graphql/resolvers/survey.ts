import { adaptResolver } from '@/main/adapters/apollo-server-resolve-adapter'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'

export default {
  Query: {
    surveys: async (): Promise<any> => await adaptResolver(makeLoadSurveysController())
  }
}
