import { HttpResponse, HttpRequest } from './http'

export interface Controller {
  async handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
