import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from '@/presentation/protocols'
import { AddSurvey, Controller, HttpResponse, Validation } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (HttpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(HttpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { question, answers } = HttpRequest.body
      await this.addSurvey.add({
        question,
        answers,
        date: new Date()
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
