import { DbAuthentication } from './db-authentication'

import { HashComparerSpy, EncrypterSpy, UpdateAccessTokenRepositorySpy, LoadAccountByEmailRepositorySpy } from '@/data/test'
import { mockAuthenticationParams } from '@/domain/test'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  )
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('DBAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()

    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)

    const expected = authenticationParams.email
    expect(loadAccountByEmailRepositorySpy.email).toBe(expected)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockRejectedValueOnce(new Error())

    const authenticationParams = mockAuthenticationParams()
    const promise = sut.auth(authenticationParams)

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockResolvedValueOnce(null)

    const authenticationParams = mockAuthenticationParams()
    const accessToken = await sut.auth(authenticationParams)

    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut()

    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)

    const expected = {
      password: authenticationParams.password,
      hash: loadAccountByEmailRepositorySpy.accountModel.password
    }
    expect(hashComparerSpy.plaintext).toBe(expected.password)
    expect(hashComparerSpy.digest).toBe(expected.hash)
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockRejectedValueOnce(new Error())

    const authenticationParams = mockAuthenticationParams()
    const promise = sut.auth(authenticationParams)

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockResolvedValueOnce(false)

    const authenticationParams = mockAuthenticationParams()
    const accessToken = await sut.auth(authenticationParams)

    expect(accessToken).toBeNull()
  })

  test('Should call TokeGenerator with correct id', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()

    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)

    const expected = loadAccountByEmailRepositorySpy.accountModel.id
    expect(encrypterSpy.plaintext).toBe(expected)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockRejectedValueOnce(new Error())

    const authenticationParams = mockAuthenticationParams()
    const promise = sut.auth(authenticationParams)

    await expect(promise).rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const { sut, encrypterSpy } = makeSut()

    const authenticationParams = mockAuthenticationParams()
    const accessToken = await sut.auth(authenticationParams)

    const expected = encrypterSpy.ciphertext
    expect(accessToken).toBe(expected)
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, encrypterSpy, updateAccessTokenRepositorySpy, loadAccountByEmailRepositorySpy } = makeSut()

    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)

    const expected = {
      id: loadAccountByEmailRepositorySpy.accountModel.id,
      ciphertext: encrypterSpy.ciphertext
    }
    expect(updateAccessTokenRepositorySpy.id).toBe(expected.id)
    expect(updateAccessTokenRepositorySpy.token).toBe(expected.ciphertext)
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken').mockRejectedValueOnce(new Error())

    const authenticationParams = mockAuthenticationParams()
    const promise = sut.auth(authenticationParams)

    await expect(promise).rejects.toThrow()
  })
})
