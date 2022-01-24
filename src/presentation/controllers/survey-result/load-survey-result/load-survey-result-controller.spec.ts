import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest, LoadSurveyById, LoadSurveyResult } from './load-survey-result-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyById, mockLoadSurveyResult, mockSurveyResult } from '@/presentation/test'

const makeLoadSurveyResultHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
  return mockLoadSurveyById()
}

const makeLoadSurveyResultStub = (): LoadSurveyResult => {
  return mockLoadSurveyResult()
}

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyByIdStub()
  const loadSurveyResultStub = makeLoadSurveyResultStub()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    const httpRequest = makeLoadSurveyResultHttpRequest()
    await sut.handle(httpRequest)

    const expected = 'any_survey_id'
    expect(loadByIdSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)

    const httpRequest = makeLoadSurveyResultHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = forbidden(new InvalidParamError('surveyId'))
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())

    const httpRequest = makeLoadSurveyResultHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new Error())
    expect(httpResponse).toEqual(expected)
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultStub, 'loadBySurveyId')

    const httpRequest = makeLoadSurveyResultHttpRequest()
    await sut.handle(httpRequest)

    const expected = 'any_survey_id'
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())

    const httpRequest = makeLoadSurveyResultHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new Error())
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpRequest = makeLoadSurveyResultHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = ok(mockSurveyResult())
    expect(httpResponse).toEqual(expected)
  })
})
