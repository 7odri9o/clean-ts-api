import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import { Collection } from 'mongodb'

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

      const account = await sut.add({
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      })

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('valid_name')
      expect(account.email).toBe('valid_email@email.com')
      expect(account.password).toBe('valid_password')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      })

      const account = await sut.loadByEmail('valid_email@email.com')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('valid_name')
      expect(account?.email).toBe('valid_email@email.com')
      expect(account?.password).toBe('valid_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail('valid_email@email.com')

      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const accountData = {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      const { insertedId } = await accountCollection.insertOne(accountData)
      const accountId = insertedId.toHexString()
      const accountBeforeUpdate = await accountCollection.findOne({ email: accountData.email })

      await sut.updateAccessToken(accountId, 'any_token')

      const accountAfterUpdate = await accountCollection.findOne({ email: accountData.email })
      expect(accountBeforeUpdate?.accessToken).toBeFalsy()
      expect(accountAfterUpdate).toBeTruthy()
      expect(accountAfterUpdate?.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        accessToken: 'any_token'
      })

      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('valid_name')
      expect(account?.email).toBe('valid_email@email.com')
      expect(account?.password).toBe('valid_password')
    })

    test('Should return an account on loadByToken success if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        accessToken: 'any_token',
        role: 'admin'
      })

      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('valid_name')
      expect(account?.email).toBe('valid_email@email.com')
      expect(account?.password).toBe('valid_password')
    })

    test('Should return an account on loadByToken success with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        accessToken: 'any_token',
        role: 'admin'
      })

      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('valid_name')
      expect(account?.email).toBe('valid_email@email.com')
      expect(account?.password).toBe('valid_password')
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        accessToken: 'any_token'
      })

      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeFalsy()
    })

    test('Should return null if loadByToken returns null', async () => {
      const sut = makeSut()

      const account = await sut.loadByToken('any_token')

      expect(account).toBeFalsy()
    })
  })
})
