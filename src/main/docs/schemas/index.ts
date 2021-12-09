import { accountSchema } from './account'
import { errorSchema } from './errors'
import { loginParamsSchema, signupParamsSchema } from './login'
import { saveSurveyResultSchema, surveyResultSchema } from './survey-results'
import { addSurveySchema, surveyAnswerSchema, surveySchema, surveysSchema } from './surveys'

export * from './auth'
export * from './account'
export * from './errors'
export * from './login'
export * from './surveys'
export * from './survey-results'

export const schemas = {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signupParamsSchema,
  error: errorSchema,
  surveyAnswer: surveyAnswerSchema,
  survey: surveySchema,
  surveys: surveysSchema,
  addSurvey: addSurveySchema,
  saveSurveyResult: saveSurveyResultSchema,
  surveyResult: surveyResultSchema
}
