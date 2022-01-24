import app from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import request from 'supertest'
import { Collection, ObjectId } from 'mongodb'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection

const mockSurvey = (): any => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const mockAccount = (): any => ({
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password'
})

const insertMockSurvey = async (): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne(mockSurvey())
  return insertedId.toHexString()
}

const insertMockAccount = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne(mockAccount())
  return insertedId.toHexString()
}

const updateAccountWithFakeAccessToken = async (accountId: string, token: string): Promise<void> => {
  await accountCollection.updateOne({
    _id: new ObjectId(accountId)
  }, {
    $set: {
      accessToken: token
    }
  })
}

const makeAccessToken = async (): Promise<string> => {
  const accountId = await insertMockAccount()
  const token = await sign({ id: accountId }, env.jwtSecret)
  await updateAccountWithFakeAccessToken(accountId, token)
  return token
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_survey_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken', async () => {
      const surveyId = await insertMockSurvey()
      const token = await makeAccessToken()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', token)
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })
})
