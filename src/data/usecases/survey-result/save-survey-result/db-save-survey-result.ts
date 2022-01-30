import {
  SurveyResultModel,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  LoadSurveyResultRepository
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (params: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(params)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(params.surveyId)
    return surveyResult
  }
}
