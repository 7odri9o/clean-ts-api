import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import { getAddSurveyParams } from '@/infra/test'

import MockDate from 'mockdate'
import { Collection, ObjectId } from 'mongodb'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const mockSurvey = async (): Promise<string> => {
  const data = getAddSurveyParams()
  const { insertedId } = await surveyCollection.insertOne(data)
  return insertedId.toHexString()
}

const mockSurveyResult = async (surveyId: string, accountId: string, answer: string): Promise<string> => {
  const data = {
    surveyId: new ObjectId(surveyId),
    accountId: new ObjectId(accountId),
    answer,
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

const mockAccountNew = async (name: string): Promise<string> => {
  const data = {
    name: `${name}_name`,
    email: `${name}email@email.com`,
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
      await mockSurveyResult(surveyId, accountId, 'any_answer')

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

  describe('loadBySurveyId()', () => {
    test('Should load a survey result', async () => {
      const sut = makeSut()

      const accountIdOne = await mockAccountNew('accountOne')
      const accountIdTwo = await mockAccountNew('accountTwo')
      const accountIdThree = await mockAccountNew('accountThree')

      const surveyId = await mockSurvey()
      await mockSurveyResult(surveyId, accountIdOne, 'any_answer')
      await mockSurveyResult(surveyId, accountIdTwo, 'any_answer')
      await mockSurveyResult(surveyId, accountIdThree, 'other_answer')

      const surveyResult = await sut.loadBySurveyId(surveyId)

      const expected = {
        surveyId,
        question: 'any_question',
        date: new Date(),
        answers: [{
          answer: 'any_answer',
          image: 'any_image',
          count: 2,
          percent: 66.66666666666666
        }, {
          answer: 'other_answer',
          count: 1,
          percent: 33.33333333333333
        }]
      }

      expect(surveyResult).toEqual(expected)
    }, 300000)
  })
})
