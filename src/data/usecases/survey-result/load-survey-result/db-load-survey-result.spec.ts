import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { mockLoadSurveyResultRepository } from '@/data/test'
import { DbLoadSurveyResult } from './db-load-survey-result'

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
})
