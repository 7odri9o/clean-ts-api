import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { AuthenticatedHttpRequest, Controller, HttpResponse, LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: AuthenticatedHttpRequest): Promise<HttpResponse> {
    try {
      const { body: { answer }, params: { surveyId }, accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answers = survey.answers.map(a => a.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      await this.saveSurveyResult.save({
        surveyId,
        accountId: accountId.toString(),
        answer: httpRequest.body.answer,
        date: new Date()
      })
      return new Promise(resolve => resolve({ statusCode: 200, body: {} }))
    } catch (error) {
      return serverError(error)
    }
  }
}
