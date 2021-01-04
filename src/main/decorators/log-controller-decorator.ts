import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { Controller, HttpResponse } from '@/presentations/protocols'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logger: LogErrorRepository
  ) {}

  async handle (request: any): Promise<HttpResponse> {
    const httpResponse: HttpResponse = await this.controller.handle(request)
    if (httpResponse.statusCode === 500) {
      const stack: string = httpResponse.body?.stack
      console.log(this.logger)
      await this.logger.logError(stack)
    }
    return httpResponse
  }
}
