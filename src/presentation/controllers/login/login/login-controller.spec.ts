import { LoginController } from './login-controller'
import { Authentication, Validation } from './login-controller-protocols'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'

import { mockAuthentication, mockValidation, authenticationHttpRequest } from '@/presentation/test'

type SutTypes = {
  sut: LoginController
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    const httpRequest = authenticationHttpRequest
    await sut.handle(httpRequest)

    const expected = {
      email: 'any_email@email.com',
      password: 'any_password'
    }
    expect(authSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce('')

    const httpRequest = authenticationHttpRequest
    const httpResponse = await sut.handle(httpRequest)

    const expected = unauthorized()
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 500 Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())

    const httpRequest = authenticationHttpRequest
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new ServerError(''))
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpRequest = authenticationHttpRequest
    const httpResponse = await sut.handle(httpRequest)

    const expected = ok({
      accessToken: 'any_token'
    })
    expect(httpResponse).toEqual(expected)
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = authenticationHttpRequest
    await sut.handle(httpRequest)

    const expected = httpRequest.body
    expect(validateSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpRequest = authenticationHttpRequest
    const httpResponse = await sut.handle(httpRequest)

    const expected = badRequest(new MissingParamError('any_field'))
    expect(httpResponse).toEqual(expected)
  })
})
