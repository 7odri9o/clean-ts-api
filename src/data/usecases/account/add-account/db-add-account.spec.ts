import {
  AddAccountRepository,
  Hasher, LoadAccountByEmailRepository
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

import {
  mockHasher,
  mockAddAccountRepository,
  mockLoadAccountByEmailRepository,
  getAddAccountParams
} from '@/data/test'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository(false)
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    addAccountRepositoryStub,
    hasherStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    const params = getAddAccountParams()
    await sut.add(params)

    const expected = 'any_password'
    expect(hashSpy).toHaveBeenCalledWith(expected)
  })

  test('Should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())

    const params = getAddAccountParams()
    const promise = sut.add(params)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const params = getAddAccountParams()
    await sut.add(params)

    const expected = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'hashed_password'
    }
    expect(addSpy).toHaveBeenCalledWith(expected)
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())

    const params = getAddAccountParams()
    const promise = sut.add(params)

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const params = getAddAccountParams()
    const account = await sut.add(params)

    const expected = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'hashed_password'
    }
    expect(account).toEqual(expected)
  })

  test('Should return null if LoadAccountByEmailRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'hashed_password'
    })

    const params = getAddAccountParams()
    const account = await sut.add(params)

    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    const params = getAddAccountParams()
    await sut.add(params)

    const expected = 'any_email@email.com'
    expect(loadSpy).toHaveBeenCalledWith(expected)
  })
})
