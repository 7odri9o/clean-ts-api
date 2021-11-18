import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import MockDate from 'mockdate'
import { Collection } from 'mongodb'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const makeFakeSurvey = (): any => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeFakeAccount = (): any => ({
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

const makeFakeSurveyResult = (surveyId: string, accountId: string): any => {
  return {
    surveyId,
    accountId,
    answer: 'any_answer',
    date: new Date()
  }
}

const getSurveyId = async (): Promise<string> => {
  const { insertedId } = await surveyResultCollection.insertOne(makeFakeSurvey())
  return insertedId.toHexString()
}

const getSurveyResultId = async (surveyId: string, accountId: string): Promise<string> => {
  const { insertedId } = await surveyResultCollection.insertOne(makeFakeSurveyResult(surveyId, accountId))
  return insertedId.toHexString()
}

const getAccountId = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne(makeFakeAccount())
  return insertedId.toHexString()
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(process.env.MONGO_URL as string)
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
      const surveyId = await getSurveyId()
      const accountId = await getAccountId()
      const sut = makeSut()

      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: 'any_answer',
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.id).toBeTruthy()
      expect(surveyResult?.surveyId).toBeTruthy()
      expect(surveyResult?.accountId).toBeTruthy()
      expect(surveyResult?.date).toBeTruthy()
      expect(surveyResult?.answer).toBe('any_answer')
    })

    test('Should update a survey result if exists', async () => {
      const surveyId = await getSurveyId()
      const accountId = await getAccountId()
      const surveyResultId = await getSurveyResultId(surveyId, accountId)
      const sut = makeSut()

      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: 'other_answer',
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.id).toEqual(surveyResultId)
      expect(surveyResult?.surveyId).toBeTruthy()
      expect(surveyResult?.accountId).toBeTruthy()
      expect(surveyResult?.date).toBeTruthy()
      expect(surveyResult?.answer).toBe('other_answer')
    })
  })
})
