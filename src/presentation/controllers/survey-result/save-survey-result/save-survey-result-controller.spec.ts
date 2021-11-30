import { SaveSurveyResultController } from './save-survey-result-controller'
import { LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError, ServerError } from '@/presentation/errors'

import MockDate from 'mockdate'

import { mockLoadSurveyById, mockSaveSurveyResult, saveSurveyResultHttpRequest } from '@/presentation/test'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadById = jest.spyOn(loadSurveyByIdStub, 'loadById')

    const httpRequest = saveSurveyResultHttpRequest()
    await sut.handle(httpRequest)

    const expected = 'any_survey_id'
    expect(loadById).toHaveBeenCalledWith(expected)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)

    const httpRequest = saveSurveyResultHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = forbidden(new InvalidParamError('surveyId'))
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())

    const httpRequest = saveSurveyResultHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new ServerError(''))
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = saveSurveyResultHttpRequest()
    httpRequest.body.answer = 'wrong_answer'
    const httpResponse = await sut.handle(httpRequest)

    const expected = forbidden(new InvalidParamError('answer'))
    expect(httpResponse).toEqual(expected)
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')

    const httpRequest = saveSurveyResultHttpRequest()
    await sut.handle(httpRequest)

    const expected = {
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    }
    expect(saveSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error())

    const httpRequest = saveSurveyResultHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new ServerError(''))
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpRequest = saveSurveyResultHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = ok({
      id: 'any_survey_result_id',
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    })
    expect(httpResponse).toEqual(expected)
  })
})
