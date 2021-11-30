import { AddSurvey, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'

import MockDate from 'mockdate'

import { mockAddSurvey, mockValidation, addSurveyHttpRequest } from '@/presentation/test'

type SutTypes = {
  sut: AddSurveyController
  addSurveyStub: AddSurvey
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    addSurveyStub,
    validationStub
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = addSurveyHttpRequest
    await sut.handle(httpRequest)

    const expected = httpRequest.body
    expect(validateSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    const httpRequest = addSurveyHttpRequest
    const httpResponse = await sut.handle(httpRequest)

    const expected = badRequest(new Error())
    expect(httpResponse).toEqual(expected)
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')

    const httpRequest = addSurveyHttpRequest
    await sut.handle(httpRequest)

    const expected = {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
    expect(addSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())

    const httpRequest = addSurveyHttpRequest
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new Error())
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 204 on AddSurvey success', async () => {
    const { sut } = makeSut()

    const httpRequest = addSurveyHttpRequest
    const httpResponse = await sut.handle(httpRequest)

    const expected = noContent()
    expect(httpResponse).toEqual(expected)
  })
})
