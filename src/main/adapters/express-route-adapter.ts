import { Controller } from '@/presentations/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.body || {}),
      ...(req.params),
      accountId: req.accountId
    }
    const httpReponse = await controller.handle(request)
    console.log(httpReponse)
    if (httpReponse.statusCode >= 200 && httpReponse.statusCode <= 299) {
      res.status(httpReponse.statusCode).json(httpReponse.body)
    } else {
      res.status(httpReponse.statusCode).json({
        error: httpReponse.body.message
      })
    }
  }
}
