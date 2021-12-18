import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import MockDate from 'mockdate'
import { Collection, ObjectId } from 'mongodb'

import { getAddSurveyParams } from '@/infra/test'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const mockSurvey = async (): Promise<string> => {
  const data = getAddSurveyParams()
  const { insertedId } = await surveyCollection.insertOne(data)
  return insertedId.toHexString()
}

const mockSurveyResult = async (surveyId: string, accountId: string): Promise<string> => {
  const data = {
    surveyId: new ObjectId(surveyId),
    accountId: new ObjectId(accountId),
    answer: 'any_answer',
    date: new Date()
  }
  const { insertedId } = await surveyResultCollection.insertOne(data)
  return insertedId.toHexString()
}

const mockAccount = async (): Promise<string> => {
  const data = {
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

      const expected = {
        surveyId,
        question: 'any_question',
        date: new Date(),
        answers: [{
          answer: 'any_answer',
          image: 'any_image',
          count: 1,
          percent: 100
        }, {
          answer: 'other_answer',
          count: 0,
          percent: 0
        }]
      }
      expect(surveyResult).toEqual(expected)
    }, 300000)

    test('Should update a survey result if it exists', async () => {
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

      const expected = {
        surveyId,
        question: 'any_question',
        date: new Date(),
        answers: [{
          answer: 'other_answer',
          count: 1,
          percent: 100
        }, {
          answer: 'any_answer',
          image: 'any_image',
          count: 0,
          percent: 0
        }]
      }

      expect(surveyResult).toEqual(expected)
    }, 300000)
  })
})
