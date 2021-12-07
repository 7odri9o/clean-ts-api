import {
  Decrypter,
  LoadAccountByTokenRepository
} from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

import {
  mockDecrypter,
  mockLoadAccountByTokenRepository
} from '@/data/test'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    const accessToken = 'any_token'
    const role = 'any_role'
    await sut.load(accessToken, role)

    const expected = 'any_token'
    expect(decryptSpy).toHaveBeenCalledWith(expected)
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)

    const accessToken = 'any_token'
    const role = 'any_role'
    const account = await sut.load(accessToken, role)

    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')

    const accessToken = 'any_token'
    const role = 'any_role'
    await sut.load(accessToken, role)

    const expected = {
      accessToken: 'any_token',
      role: 'any_role'
    }
    expect(loadByTokenSpy).toHaveBeenCalledWith(expected.accessToken, expected.role)
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)

    const accessToken = 'any_token'
    const role = 'any_role'
    const account = await sut.load(accessToken, role)

    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const accessToken = 'any_token'
    const role = 'any_role'
    const account = await sut.load(accessToken, role)

    const expected = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'hashed_password'
    }
    expect(account).toEqual(expected)
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())

    const accessToken = 'any_token'
    const role = 'any_role'
    const promise = sut.load(accessToken, role)

    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockRejectedValueOnce(new Error())

    const accessToken = 'any_token'
    const role = 'any_role'
    const promise = sut.load(accessToken, role)

    await expect(promise).rejects.toThrow()
  })
})
