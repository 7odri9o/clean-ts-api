import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { mockSurveyResult } from '@/presentation/test'
import { SurveyResultModel } from '../save-survey-result/db-save-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'

describe('DbLoadSurveyResult UseCase', () => {
  test('Should call LoadSurveyResultRepository', async () => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
      async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
        return Promise.resolve(mockSurveyResult())
      }
    }
    const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    const surveyId = 'any_survey_id'
    await sut.loadBySurveyId(surveyId)

    const expected = 'any_survey_id'
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(expected)
  })
})
