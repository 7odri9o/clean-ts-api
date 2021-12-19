import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { mockSurveyResult } from '@/presentation/test'
import { SurveyResultModel } from '../save-survey-result/db-save-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'

type SutTypes = {
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  sut: DbLoadSurveyResult
}

const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResult())
    }
  }

  return new LoadSurveyResultRepositoryStub()
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
  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    const surveyId = 'any_survey_id'
    await sut.loadBySurveyId(surveyId)

    const expected = 'any_survey_id'
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(expected)
  })
})
