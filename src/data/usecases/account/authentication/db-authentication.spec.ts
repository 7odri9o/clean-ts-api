import {
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'
import { DbAuthentication } from './db-authentication'

import {
  mockEncrypter,
  mockHashComparer,
  mockLoadAccountByEmailRepository,
  mockUpdateAccessTokenRepository,
  getAuthenticationParams
} from '@/data/test'

type SutTypes = {
  sut: DbAuthentication
  hashComparerStub: HashComparer
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository(true)
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    hashComparerStub,
    loadAccountByEmailRepositoryStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DBAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    const params = getAuthenticationParams()
    await sut.auth(params)

    const expected = 'any_email@email.com'
    expect(loadSpy).toHaveBeenCalledWith(expected)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())

    const params = getAuthenticationParams()
    const promise = sut.auth(params)

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)

    const params = getAuthenticationParams()
    const accessToken = await sut.auth(params)

    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    const params = getAuthenticationParams()
    await sut.auth(params)

    const expected = {
      value: 'any_password',
      hash: 'hashed_password'
    }
    expect(compareSpy).toHaveBeenCalledWith(expected.value, expected.hash)
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())

    const params = getAuthenticationParams()
    const promise = sut.auth(params)

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)

    const params = getAuthenticationParams()
    const accessToken = await sut.auth(params)

    expect(accessToken).toBeNull()
  })

  test('Should call TokeGenerator with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const params = getAuthenticationParams()
    await sut.auth(params)

    const expected = 'any_id'
    expect(encryptSpy).toHaveBeenCalledWith(expected)
  })

  test('Should throw if TokeGenerator throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())

    const params = getAuthenticationParams()
    const promise = sut.auth(params)

    await expect(promise).rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const { sut } = makeSut()

    const params = getAuthenticationParams()
    const accessToken = await sut.auth(params)

    const expected = 'any_token'
    expect(accessToken).toBe(expected)
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const compareSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

    const params = getAuthenticationParams()
    await sut.auth(params)

    const expected = {
      id: 'any_id',
      accessToken: 'any_token'
    }
    expect(compareSpy).toHaveBeenCalledWith(expected.id, expected.accessToken)
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())

    const params = getAuthenticationParams()
    const promise = sut.auth(params)

    await expect(promise).rejects.toThrow()
  })
})
