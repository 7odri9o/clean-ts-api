import { AuthMiddleware } from './auth-middleware'
import { HttpRequest } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/presentation/errors'

import { LoadAccountByTokenSpy } from '@/presentation/test'

import { faker } from '@faker-js/faker'

const mockHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)
  return {
    sut,
    loadAccountByTokenSpy
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpRequest = mockHttpRequest()
    httpRequest.headers = {}

    const httpResponse = await sut.handle(httpRequest)

    const expected = forbidden(new AccessDeniedError())
    expect(httpResponse).toEqual(expected)
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = faker.random.word()
    const { sut, loadAccountByTokenSpy } = makeSut(role)

    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)

    const expected = {
      accessToken: 'any_token',
      role
    }
    expect(loadAccountByTokenSpy.accessToken).toEqual(expected.accessToken)
    expect(loadAccountByTokenSpy.role).toBe(role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.accountModel = null

    const httpRequest = mockHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = forbidden(new AccessDeniedError())
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()

    const httpRequest = mockHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = ok({
      accountId: loadAccountByTokenSpy.accountModel.id
    })
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    jest.spyOn(loadAccountByTokenSpy, 'load').mockRejectedValueOnce(new Error())

    const httpRequest = mockHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new Error())
    expect(httpResponse).toEqual(expected)
  })
})
