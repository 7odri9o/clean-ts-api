import { Controller, LoadSurveys, HttpRequest, HttpResponse } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load()
    return new Promise(resolve => resolve({
      statusCode: 200,
      body: {}
    }))
  }
}
