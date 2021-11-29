import MockDate from 'mockdate'

import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from './db-save-survey-result-protocols'

import {
  mockSaveSurveyResultRepository,
  getSaveSurveyResultParams
} from '@/data/test'

type SutTypes = {
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  sut: DbSaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    saveSurveyResultRepositoryStub,
    sut
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')

    const params = getSaveSurveyResultParams()
    await sut.save(params)

    expect(saveSpy).toHaveBeenCalledWith(params)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())

    const params = getSaveSurveyResultParams()
    const promise = sut.save(params)

    await expect(promise).rejects.toThrow()
  })

  test('Should return a survey result on success', async () => {
    const { sut } = makeSut()

    const params = getSaveSurveyResultParams()
    const surveyResult = await sut.save(params)

    const expected = {
      id: 'any_id',
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    }
    expect(surveyResult).toEqual(expected)
  })
})
