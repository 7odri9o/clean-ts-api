import { SignUpController } from './signup-controller'
import { AddAccount, Authentication, Validation } from './signup-controller-protocols'
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { ok, badRequest, serverError, forbidden } from '@/presentation/helpers/http/http-helper'

import { mockAddAccount, mockAuthentication, mockValidation, signupHttpRequest } from '@/presentation/test'

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(new Error())

    const httpRequest = signupHttpRequest
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new ServerError(''))
    expect(httpResponse).toEqual(expected)
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = signupHttpRequest
    await sut.handle(httpRequest)

    const expected = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    }
    expect(addSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValueOnce(null)

    const httpRequest = signupHttpRequest
    const httpResponse = await sut.handle(httpRequest)

    const expected = forbidden(new EmailInUseError())
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = signupHttpRequest
    const httpResponse = await sut.handle(httpRequest)

    const expected = ok({ accessToken: 'any_token' })
    expect(httpResponse).toEqual(expected)
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = signupHttpRequest
    await sut.handle(httpRequest)

    const expected = httpRequest.body
    expect(validateSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpRequest = signupHttpRequest
    const httpResponse = await sut.handle(httpRequest)

    const expected = badRequest(new MissingParamError('any_field'))
    expect(httpResponse).toEqual(expected)
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    const httpRequest = signupHttpRequest
    await sut.handle(httpRequest)

    const expected = {
      email: 'any_email@email.com',
      password: 'any_password'
    }
    expect(authSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return 500 Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())

    const httpRequest = signupHttpRequest
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new ServerError(''))
    expect(httpResponse).toEqual(expected)
  })
})
