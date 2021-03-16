import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'
import schemaDirectives from '@/main/graphql/directives'
import { GraphQLError } from 'graphql'

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    if (checkError(error, 'AuthenticationError')) {
      response.data = undefined
      response.http.status = 401
    } else if (checkError(error, 'ForbiddenError')) {
      response.http.status = 403
    } else {
      response.http.status = 500
    }
  })
}

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(name => name === errorName)
}

export default (app: Express): void => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    schemaDirectives,
    context: ({ req }) => ({ req }),
    plugins: [{
      requestDidStart: () => ({
        willSendResponse: ({ response, errors }) => handleErrors(response, errors)
      })
    }]
  })
  server.applyMiddleware({ app })
}