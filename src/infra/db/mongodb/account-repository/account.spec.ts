import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

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
    expect(accountBeforeUpdate?.accessToken).toBeFalsy()
    await sut.updateAccessToken(accountId, 'any_token')
    const accountAfterUpdate = await accountCollection.findOne({ email: accountData.email })
    expect(accountAfterUpdate).toBeTruthy()
    expect(accountAfterUpdate?.accessToken).toBe('any_token')
  })
})
