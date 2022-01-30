import { DbAddSurvey } from './db-add-survey'
import { AddSurveyRepositorySpy } from '@/data/test'

import { mockAddSurveyParams } from '@/domain/test'

import MockDate from 'mockdate'

type SutTypes = {
  addSurveyRepositorySpy: AddSurveyRepositorySpy
  sut: DbAddSurvey
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)
  return {
    sut,
    addSurveyRepositorySpy
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()

    const surveyData = mockAddSurveyParams()
    await sut.add(surveyData)

    expect(addSurveyRepositorySpy.addSurveyParams).toEqual(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    jest.spyOn(addSurveyRepositorySpy, 'add').mockRejectedValueOnce(new Error())

    const surveyData = mockAddSurveyParams()
    const promise = sut.add(surveyData)

    await expect(promise).rejects.toThrow()
  })
})
