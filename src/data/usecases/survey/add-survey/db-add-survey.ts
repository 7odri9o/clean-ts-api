import {
  AddSurvey,
  AddSurveyParams,
  AddSurveyRepository
} from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add (params: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(params)
    return new Promise(resolve => resolve())
  }
}
