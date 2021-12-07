import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const getSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})
