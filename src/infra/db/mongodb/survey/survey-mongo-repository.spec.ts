import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import { mockAddSurveyParams } from '@/domain/test'

import MockDate from 'mockdate'
import { Collection } from 'mongodb'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('SurveyMongoRepository', () => {
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

      const data = mockAddSurveyParams()
      await sut.add(data)

      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const sut = makeSut()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      await surveyCollection.insertMany(addSurveyModels)

      const surveys = await sut.loadAll()

      expect(surveys).toBeArrayOfSize(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
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
      const data = mockAddSurveyParams()
      const { insertedId } = await surveyCollection.insertOne(data)
      const surveyId = insertedId.toHexString()

      const survey = await sut.loadById(surveyId)

      expect(survey).toBeTruthy()
    })
  })
})
