import { LogMongoRepository } from './log-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import { Collection } from 'mongodb'

import { faker } from '@faker-js/faker'

let errorCollection: Collection

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()

    const stack = faker.random.words()
    await sut.logError(stack)

    const count = await errorCollection.countDocuments()
    const expected = 1
    expect(count).toBe(expected)
  })
})
