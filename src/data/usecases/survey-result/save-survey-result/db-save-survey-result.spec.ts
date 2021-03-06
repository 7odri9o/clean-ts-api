import { DbSaveSurveyResult } from './db-save-survey-result'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from './db-save-survey-result-protocols'

import {
  mockSaveSurveyResultRepository,
  mockLoadSurveyResultRepository,
  getSaveSurveyResultParams
} from '@/data/test'

import MockDate from 'mockdate'

type SutTypes = {
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  sut: DbSaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
  return {
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
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

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())

    const params = getSaveSurveyResultParams()
    const promise = sut.save(params)

    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    const params = getSaveSurveyResultParams()
    await sut.save(params)

    const expected = 'any_survey_id'
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return a survey result on success', async () => {
    const { sut } = makeSut()

    const params = getSaveSurveyResultParams()
    const surveyResult = await sut.save(params)

    const expected = {
      surveyId: 'any_survey_id',
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        count: 1,
        percent: 5
      }, {
        answer: 'other_answer',
        image: 'other_image',
        count: 10,
        percent: 80
      }],
      date: new Date()
    }
    expect(surveyResult).toEqual(expected)
  })
})
