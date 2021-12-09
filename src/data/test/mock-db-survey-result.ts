import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  const surveyResult: SurveyResultModel = {
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
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(surveyResult)
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
