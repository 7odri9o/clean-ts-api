import { ok } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

const httpResponse: HttpResponse = ok({
  accessToken: 'any_token'
})

export const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(httpResponse)
    }
  }
  return new ControllerStub()
}
