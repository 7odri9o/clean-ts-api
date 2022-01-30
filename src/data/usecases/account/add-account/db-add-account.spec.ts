import { DbAddAccount } from './db-add-account'
import { HasherSpy, AddAccountRepositorySpy, LoadAccountByEmailRepositorySpy } from '@/data/test'

import { mockAccountModel, mockAddAccountParams } from '@/domain/test'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  loadAccountByEmailRepositorySpy.accountModel = null
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()

    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)

    const expected = addAccountParams.password
    expect(hasherSpy.plaintext).toBe(expected)
  })

  test('Should throw if hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockRejectedValueOnce(new Error())

    const addAccountParams = mockAddAccountParams()
    const promise = sut.add(addAccountParams)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()

    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)

    const expected = {
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.digest
    }
    expect(addAccountRepositorySpy.addAccountParams).toEqual(expected)
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add').mockRejectedValueOnce(new Error())

    const addAccountParams = mockAddAccountParams()
    const promise = sut.add(addAccountParams)

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()

    const addAccountParams = mockAddAccountParams()
    const account = await sut.add(addAccountParams)

    const expected = addAccountRepositorySpy.accountModel
    expect(account).toEqual(expected)
  })

  test('Should return null if LoadAccountByEmailRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()

    loadAccountByEmailRepositorySpy.accountModel = mockAccountModel()
    const addAccountParams = mockAddAccountParams()
    const account = await sut.add(addAccountParams)

    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()

    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)

    const expected = addAccountParams.email
    expect(loadAccountByEmailRepositorySpy.email).toBe(expected)
  })
})
