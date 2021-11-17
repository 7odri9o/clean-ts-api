import MockDate from 'mockdate'

import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const makeFakeSurveys = (): any[] => ([{
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
}, {
  question: 'other_question',
  answers: [{
    image: 'other_image',
    answer: 'other_answer'
  }],
  date: new Date()
}])

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

let surveyCollection: Collection

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
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should adds a new survey on success', async () => {
      const sut = makeSut()

      await sut.add({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          },
          {
            answer: 'other_answer'
          }
        ],
        date: new Date()
      })

      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany(makeFakeSurveys())
      const sut = makeSut()

      const surveys = await sut.loadAll()

      const [surveys1, surveys2] = surveys

      const { id: id1, question: question1, answers: answers1, date: date1 } = surveys1
      expect(surveys1).toBeTruthy()
      expect(id1).toBeTruthy()
      expect(question1).toBe('any_question')
      expect(date1).toEqual(new Date())
      const [{ answer: aswer1, image: image1 }] = answers1
      expect(aswer1).toBe('any_answer')
      expect(image1).toBe('any_image')

      const { id: id2, question: question2, answers: answers2, date: date2 } = surveys2
      expect(surveys2).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(question2).toBe('other_question')
      expect(date2).toEqual(new Date())
      const [{ answer: aswer2, image: image2 }] = answers2
      expect(aswer2).toBe('other_answer')
      expect(image2).toBe('other_image')
    })
  })
})
