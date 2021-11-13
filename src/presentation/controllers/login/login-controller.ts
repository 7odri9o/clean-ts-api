import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from './login-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authenticator: Authentication

  constructor (authenticator: Authentication, validation: Validation) {
    this.validation = validation
    this.authenticator = authenticator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body
      const accessToken = await this.authenticator.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
