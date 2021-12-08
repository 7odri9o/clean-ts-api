import { addSurvey } from './add-survey-path'
import { loadSurveys } from './load-surveys'

export const surveysPath = {
  get: loadSurveys,
  post: addSurvey
}
