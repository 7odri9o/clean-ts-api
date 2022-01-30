import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { mockAccountModel } from '@/domain/test'
import { ok } from '@/presentation/helpers/http/http-helper'

export class ControllerSpy implements Controller {
  httpResponse = ok(mockAccountModel())
  httpRequest: HttpRequest

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest
    return Promise.resolve(this.httpResponse)
  }
}
