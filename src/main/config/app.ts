import express from 'express'
import setupMiddleware from './middlewares'
import setupRoutes from './routes'
import setupSwagger from './swagger'
import setupStaticFiles from './static-files'
import setupApolloServer from './apollo-server'

const app = express()
setupStaticFiles(app)
setupSwagger(app)
setupMiddleware(app)
setupRoutes(app)
setupApolloServer(app)

export default app
