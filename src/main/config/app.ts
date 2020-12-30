import express from 'express'
import setupMiddleware from './middlewares'
import setupRoutes from './routes'
import setupSwagger from './config-swagger'
import setupStaticFiles from './static-files'

const app = express()
setupStaticFiles(app)
setupSwagger(app)
setupMiddleware(app)
setupRoutes(app)

export default app
