import { LoadSurveyResultRepository } from './db-load-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockLoadSurveyResultRepository } from '@/data/test'

import MockDate from 'mockdate'

type SutTypes = {
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  sut: DbLoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  return {
    loadSurveyResultRepositoryStub,
    sut
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    const surveyId = 'any_survey_id'
    await sut.loadBySurveyId(surveyId)

    const expected = 'any_survey_id'
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(expected)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())

    const surveyId = 'any_survey_id'
    const promise = sut.loadBySurveyId(surveyId)

    await expect(promise).rejects.toThrow()
  })

  test('Should return surveyResult on success', async () => {
    const { sut } = makeSut()

    const surveyId = 'any_survey_id'
    const surveyResult = await sut.loadBySurveyId(surveyId)

    const expected = {
      surveyId: 'any_survey_id',
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        count: 1,
        percent: 5
      }, {
        answer: 'other_answer',
        image: 'other_image',
        count: 10,
        percent: 80
      }],
      date: new Date()
    }
    expect(surveyResult).toEqual(expected)
  })
})
