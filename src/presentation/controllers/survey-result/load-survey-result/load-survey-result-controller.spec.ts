import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest, LoadSurveyById } from './load-survey-result-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyById } from '@/presentation/test'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
  return mockLoadSurveyById()
}

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyByIdStub()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    const expected = 'any_survey_id'
    expect(loadByIdSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = forbidden(new InvalidParamError('surveyId'))
    expect(httpResponse).toEqual(expected)
  })
})
