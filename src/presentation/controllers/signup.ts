import { HttpRequest, HttpResponse } from '../protocols/http'
export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }

    class SignUpHttpResponse implements HttpResponse {
      statusCode: number
      body: any
    }

    const signUpHttpResponse = new SignUpHttpResponse()
    return signUpHttpResponse
  }
}
