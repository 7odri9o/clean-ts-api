import { DbSaveSurveyResult } from './db-save-survey-result'

import { SaveSurveyResultRepositorySpy, LoadSurveyResultRepositorySpy } from '@/data/test'
import { mockSaveSurveyResultParams } from '@/domain/test'

import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositorySpy, loadSurveyResultRepositorySpy)
  return {
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy,
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
    const { sut, saveSurveyResultRepositorySpy } = makeSut()

    const surveyResultData = mockSaveSurveyResultParams()
    await sut.save(surveyResultData)

    expect(saveSurveyResultRepositorySpy.saveSurveyResultParams).toEqual(surveyResultData)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(saveSurveyResultRepositorySpy, 'save').mockRejectedValueOnce(new Error())

    const surveyResultData = mockSaveSurveyResultParams()
    const promise = sut.save(surveyResultData)

    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockRejectedValueOnce(new Error())

    const surveyResultData = mockSaveSurveyResultParams()
    const promise = sut.save(surveyResultData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()

    const surveyResultData = mockSaveSurveyResultParams()
    await sut.save(surveyResultData)

    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyResultData.surveyId)
  })

  test('Should return a survey result on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()

    const surveyResultData = mockSaveSurveyResultParams()
    const surveyResult = await sut.save(surveyResultData)

    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResultModel)
  })
})
