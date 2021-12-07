import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import MockDate from 'mockdate'
import { Collection } from 'mongodb'

import { getAddSurveyParams, getAddManySurveyParams } from '@/infra/test'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
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
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should adds a new survey on success', async () => {
      const sut = makeSut()

      const data = getAddSurveyParams()
      await sut.add(data)

      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const sut = makeSut()
      const data = getAddManySurveyParams()
      await surveyCollection.insertMany(data)

      const surveys = await sut.loadAll()

      expect(surveys).toBeArrayOfSize(2)
    })

    test('Should load an empty survey\'s list', async () => {
      const sut = makeSut()

      const surveys = await sut.loadAll()

      const expected = []
      expect(surveys).toEqual(expected)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const sut = makeSut()
      const data = getAddSurveyParams()
      const { insertedId } = await surveyCollection.insertOne(data)
      const surveyId = insertedId.toHexString()

      const survey = await sut.loadById(surveyId)

      expect(survey).toBeTruthy()
    })
  })
})
