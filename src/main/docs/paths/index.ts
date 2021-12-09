import { loginPath, signUpPath } from './login'
import { surveysPath } from './surveys'
import { surveysResultsPath } from './survey-results'

export const paths = {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': surveysPath,
  '/surveys/{surveyId}/results': surveysResultsPath
}
