import express from 'express'
import setupMiddleware from './middlewares'
import setupRoutes from './routes'
import setupSwagger from './config-swagger'

const app = express()
setupSwagger(app)
setupMiddleware(app)
setupRoutes(app)

export default app
