import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/presentation/errors'

import { authHttpRequest, mockLoadAccountByToken } from '@/presentation/test'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    loadAccountByTokenStub,
    sut
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpRequest = authHttpRequest()
    httpRequest.headers = {}

    const httpResponse = await sut.handle(httpRequest)

    const expected = forbidden(new AccessDeniedError())
    expect(httpResponse).toEqual(expected)
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    const httpRequest = authHttpRequest()
    await sut.handle(httpRequest)

    const expected = {
      accessToken: 'any_token',
      role
    }
    expect(loadSpy).toHaveBeenCalledWith(expected.accessToken, expected.role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)

    const httpRequest = authHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = forbidden(new AccessDeniedError())
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()

    const httpRequest = authHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = ok({ accountId: 'any_id' })
    expect(httpResponse).toEqual(expected)
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error())

    const httpRequest = authHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    const expected = serverError(new Error())
    expect(httpResponse).toEqual(expected)
  })
})
