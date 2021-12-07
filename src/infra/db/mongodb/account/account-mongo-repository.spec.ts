import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import { Collection } from 'mongodb'

import { getAddAccountParams, mockAccountWithToken, mockAccountWithTokenAndRoleAdmin } from '@/infra/test'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()

      const data = getAddAccountParams()
      const account = await sut.add(data)

      expect(account).toBeTruthy()
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()

      const data = getAddAccountParams()
      await accountCollection.insertOne(data)

      const { email } = data
      const account = await sut.loadByEmail(email)

      expect(account).toBeTruthy()
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()

      const email = 'valid_email@email.com'
      const account = await sut.loadByEmail(email)

      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const data = getAddAccountParams()
      const { email } = data
      const { insertedId } = await accountCollection.insertOne(data)
      const accountId = insertedId.toHexString()

      const token = 'any_token'
      await sut.updateAccessToken(accountId, token)

      const account = await accountCollection.findOne({ email })

      const expected = 'any_token'
      expect(account?.accessToken).toBe(expected)
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      const data = mockAccountWithToken
      await accountCollection.insertOne(data)

      const accessToken = 'any_token'
      const account = await sut.loadByToken(accessToken)

      expect(account).toBeTruthy()
    })

    test('Should return an account on loadByToken success if user is admin', async () => {
      const sut = makeSut()
      const data = mockAccountWithTokenAndRoleAdmin
      await accountCollection.insertOne(data)

      const accessToken = 'any_token'
      const account = await sut.loadByToken(accessToken)

      expect(account).toBeTruthy()
    })

    test('Should return an account on loadByToken success with admin role', async () => {
      const sut = makeSut()
      const data = mockAccountWithTokenAndRoleAdmin
      await accountCollection.insertOne(data)

      const accessToken = 'any_token'
      const role = 'admin'
      const account = await sut.loadByToken(accessToken, role)

      expect(account).toBeTruthy()
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      const data = mockAccountWithToken
      await accountCollection.insertOne(data)

      const accessToken = 'any_token'
      const role = 'admin'
      const account = await sut.loadByToken(accessToken, role)

      expect(account).toBeFalsy()
    })

    test('Should return null if loadByToken returns null', async () => {
      const sut = makeSut()

      const accessToken = 'any_token'
      const account = await sut.loadByToken(accessToken)

      expect(account).toBeFalsy()
    })
  })
})
