import { accountSchema } from './account'
import { errorSchema } from './errors'
import { loginParamsSchema, signupParamsSchema } from './login'
import { addSurveySchema, surveyAnswerSchema, surveySchema, surveysSchema } from './surveys'

export const schemas = {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signupParamsSchema,
  error: errorSchema,
  surveyAnswer: surveyAnswerSchema,
  survey: surveySchema,
  surveys: surveysSchema,
  addSurvey: addSurveySchema
}
