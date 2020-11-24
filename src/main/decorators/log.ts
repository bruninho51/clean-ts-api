import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentations/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logger: LogErrorRepository

  constructor (controller: Controller, logger: LogErrorRepository) {
    this.controller = controller
    this.logger = logger
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      const stack: string = httpResponse.body?.stack
      console.log(this.logger)
      await this.logger.logError(stack)
    }
    return httpResponse
  }
}
