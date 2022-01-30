import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import { mockAddSurveyParams, mockAddAccountParams } from '@/domain/test'

import MockDate from 'mockdate'
import { Collection, ObjectId } from 'mongodb'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const data = mockAddSurveyParams()
  const { insertedId } = await surveyCollection.insertOne(data)
  const survey = MongoHelper.map(Object.assign({}, data, { _id: insertedId })) as SurveyModel
  return survey
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

const makeAccount = async (): Promise<AccountModel> => {
  const data = mockAddAccountParams()
  const { insertedId } = await accountCollection.insertOne(data)
  const account = MongoHelper.map(Object.assign({}, data, { _id: insertedId })) as AccountModel
  return account
}

describe('SurveyResultMongoRepository', () => {
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
      const survey = await makeSurvey()
      const account = await makeAccount()
      const { id: surveyId, answers: [{ answer }] } = survey
      const { id: accountId } = account

      const sut = makeSut()
      await sut.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId)
      })

      expect(surveyResult).toBeTruthy()
    }, 300000)

    test('Should update a survey result if it exists', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()

      const surveyId = survey.id
      const accountId = account.id
      let { answer } = survey.answers[0]

      await mockSurveyResult(surveyId, accountId, answer)

      answer = survey.answers[1].answer

      const saveSurveyResultParams = {
        surveyId,
        accountId,
        answer,
        date: new Date()
      }
      await sut.save(saveSurveyResultParams)

      const surveyResult = await surveyResultCollection.find({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId)
      }).toArray()

      expect(surveyResult.length).toBe(1)
    }, 300000)
  })

  describe('loadBySurveyId()', () => {
    test('Should load a survey result', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }])

      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
    }, 300000)

    test('Should return null if there is no survey result', async () => {
      const sut = makeSut()
      const { id: surveyId } = await makeSurvey()

      const surveyResult = await sut.loadBySurveyId(surveyId)

      expect(surveyResult).toBeNull()
    }, 300000)
  })
})
