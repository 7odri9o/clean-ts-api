import { LoginController } from './login-controller'
import { HttpRequest } from './login-controller-protocols'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'

import { AuthenticationSpy, ValidationSpy } from '@/presentation/test'
import { mockAuthenticationParams } from '@/domain/test'

import { faker } from '@faker-js/faker'

const mockRequest = (): HttpRequest => ({
  body: mockAuthenticationParams()
})

type SutTypes = {
  sut: LoginController
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new LoginController(authenticationSpy, validationSpy)
  return {
    sut,
    authenticationSpy,
    validationSpy
  }
}

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    const expected = httpRequest.body
    expect(authenticationSpy.authenticationParams).toEqual(expected)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.token = null

    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = unauthorized()
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 500 Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(new Error())

    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new ServerError(''))
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = ok({ accessToken: authenticationSpy.token })
    expect(httpResponse).toEqual(expected)
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()

    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    const expected = httpRequest.body
    expect(validationSpy.input).toEqual(expected)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())

    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = badRequest(validationSpy.error)
    expect(httpResponse).toEqual(expected)
  })
})
