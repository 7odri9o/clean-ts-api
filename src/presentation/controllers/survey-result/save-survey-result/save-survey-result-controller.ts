import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const sourvey = await this.loadSurveyById.loadById(surveyId)
      if (!sourvey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return new Promise(resolve => resolve({ statusCode: 200, body: {} }))
    } catch (error) {
      return serverError(error)
    }
  }
}
