import app from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import request from 'supertest'
import { Collection, ObjectId } from 'mongodb'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection

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

const insertFakeSurveys = async (): Promise<void> => {
  await surveyCollection.insertMany(makeFakeSurveys())
}

const makeAccessToken = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    role: 'admin'
  })
  const token = await sign({ id: insertedId }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: new ObjectId(insertedId)
  }, {
    $set: {
      accessToken: token
    }
  })
  return token
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [{
            image: 'any_image',
            answer: 'any_answer'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const token = await makeAccessToken()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', token)
        .send({
          question: 'any_question',
          answers: [{
            image: 'any_image',
            answer: 'any_answer'
          }]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 204 on load surveys when there is no surveys and a valid accessToken is provided', async () => {
      const token = await makeAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', token)
        .expect(204)
    })

    test('Should return 200 on load surveys when there is surveys and a valid accessToken is provided', async () => {
      const token = await makeAccessToken()
      await insertFakeSurveys()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', token)
        .expect(200)
    })
  })
})
