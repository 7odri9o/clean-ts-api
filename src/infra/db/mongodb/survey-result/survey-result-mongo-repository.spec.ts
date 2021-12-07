import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import MockDate from 'mockdate'
import { Collection } from 'mongodb'

import { getAddSurveyParams } from '@/infra/test'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const mockSurvey = async (): Promise<string> => {
  const data = getAddSurveyParams()
  const { insertedId } = await surveyResultCollection.insertOne(data)
  return insertedId.toHexString()
}

const mockSurveyResult = async (surveyId: string, accountId: string): Promise<string> => {
  const data = {
    surveyId,
    accountId,
    answer: 'any_answer',
    date: new Date()
  }
  const { insertedId } = await surveyResultCollection.insertOne(data)
  return insertedId.toHexString()
}

const mockAccount = async (): Promise<string> => {
  const data = {
    id: 'any_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'hashed_password'
  }
  const { insertedId } = await accountCollection.insertOne(data)
  return insertedId.toHexString()
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  beforeEach(async () => {
    surveyResultCollection = await MongoHelper.getCollection('surveysResults')
    await surveyResultCollection.deleteMany({})
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const sut = makeSut()
      const surveyId = await mockSurvey()
      const accountId = await mockAccount()

      const data = {
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date()
      }
      const surveyResult = await sut.save(data)

      expect(surveyResult).toBeTruthy()
    })

    test('Should update a survey result if exists', async () => {
      const sut = makeSut()
      const surveyId = await mockSurvey()
      const accountId = await mockAccount()
      await mockSurveyResult(surveyId, accountId)

      const data = {
        surveyId,
        accountId,
        answer: 'other_answer',
        date: new Date()
      }
      const surveyResult = await sut.save(data)

      const expected = 'other_answer'
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.answer).toBe(expected)
    })
  })
})
