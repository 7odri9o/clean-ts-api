import {
  SurveyResultModel,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SaveSurveyResultRepository
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save (params: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyResultRepository.save(params)
    return surveyResult
  }
}
