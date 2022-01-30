import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepositorySpy, LoadSurveyByIdRepositorySpy } from '@/data/test'

import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyByIdRepositorySpy, loadSurveyResultRepositorySpy)
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  }
}

let surveyId: string

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()

    await sut.load(surveyId)

    const expected = surveyId
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(expected)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockRejectedValueOnce(new Error())

    const promise = sut.load(surveyId)

    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    await sut.load(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test(`Should return survey result with all answers with count and percent zero
    if LoadSurveyResultRepository returns null`, async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    const surveyResult = await sut.load(surveyId)

    const { surveyModel } = loadSurveyByIdRepositorySpy
    const expected = {
      surveyId: surveyModel.id,
      question: surveyModel.question,
      date: surveyModel.date,
      answers: surveyModel.answers.map(answer => Object.assign({}, answer, {
        count: 0,
        percent: 0
      }))
    }
    expect(surveyResult).toEqual(expected)
  })

  test('Should return surveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.load(surveyId)
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResultModel)
  })
})
