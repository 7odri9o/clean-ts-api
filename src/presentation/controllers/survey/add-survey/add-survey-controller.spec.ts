import { HttpRequest } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'

import { ValidationSpy, AddSurveySpy } from '@/presentation/test'

import { faker } from '@faker-js/faker'
import MockDate from 'mockdate'

const mockHttpRequest = (): HttpRequest => ({
  body: {
    question: faker.random.words(),
    answers: [{
      image: faker.image.imageUrl(),
      answer: faker.random.word()
    }],
    date: new Date()
  }
})

type SutTypes = {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)
  return {
    sut,
    validationSpy,
    addSurveySpy
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
    const { sut, validationSpy } = makeSut()

    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)

    const expected = httpRequest.body
    expect(validationSpy.input).toEqual(expected)
  })

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new Error()

    const httpRequest = mockHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = badRequest(validationSpy.error)
    expect(httpResponse).toEqual(expected)
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()

    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)

    const expected = httpRequest.body
    expect(addSurveySpy.addSurveyParams).toEqual(expected)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    jest.spyOn(addSurveySpy, 'add').mockRejectedValueOnce(new Error())

    const httpRequest = mockHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new Error())
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 204 on AddSurvey success', async () => {
    const { sut } = makeSut()

    const httpRequest = mockHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = noContent()
    expect(httpResponse).toEqual(expected)
  })
})
