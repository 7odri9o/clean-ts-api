import { saveSurveyResultPath } from './save-survey-result-path'
import { loadSurveyResultPath } from './load-survey-result-path'

export const surveysResultsPath = {
  put: saveSurveyResultPath,
  get: loadSurveyResultPath
}
