import { Middleware } from '@/presentations/protocols'
import { NextFunction, Request, Response } from 'express'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      accessToken: req.headers['x-access-token'],
      ...(req.headers)
    }
    const httpReponse = await middleware.handle(request)
    if (httpReponse.statusCode === 200) {
      Object.assign(req, httpReponse.body)
      next()
    } else {
      res.status(httpReponse.statusCode).json({
        error: httpReponse.body.message
      })
    }
  }
}
