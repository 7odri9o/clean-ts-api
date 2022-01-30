import { SignUpController } from './signup-controller'
import { HttpRequest } from './signup-controller-protocols'
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { ok, badRequest, serverError, forbidden } from '@/presentation/helpers/http/http-helper'

import { AuthenticationSpy, ValidationSpy, AddAccountSpy } from '@/presentation/test'

import { faker } from '@faker-js/faker'

const mockHttpRequest = (): HttpRequest => {
  const password = faker.internet.password()
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
  }
}

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const addAccountSpy = new AddAccountSpy()
  const validationSpy = new ValidationSpy()
  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy)

  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(new Error())

    const httpRequest = mockHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new ServerError(''))
    expect(httpResponse).toEqual(expected)
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()

    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)

    const expected = {
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    }
    expect(addAccountSpy.addAccountParams).toEqual(expected)
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.accountModel = null

    const httpRequest = mockHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = forbidden(new EmailInUseError())
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpRequest = mockHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = ok({ accessToken: authenticationSpy.token })
    expect(httpResponse).toEqual(expected)
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()

    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)

    const expected = httpRequest.body
    expect(validationSpy.input).toEqual(expected)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())

    const httpRequest = mockHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = badRequest(validationSpy.error)
    expect(httpResponse).toEqual(expected)
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)

    const expected = {
      email: httpRequest.body.email,
      password: httpRequest.body.password
    }
    expect(authenticationSpy.authenticationParams).toEqual(expected)
  })

  test('Should return 500 Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(new Error())

    const httpRequest = mockHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new ServerError(''))
    expect(httpResponse).toEqual(expected)
  })
})
