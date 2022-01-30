import { HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'

import { faker } from '@faker-js/faker'

export const authHttpRequest = (): HttpRequest => Object.assign({}, {
  headers: {
    'x-access-token': faker.random.word()
  }
})

export const authenticationHttpRequest: HttpRequest = {
  body: {
    email: faker.internet.email(),
    password: faker.random.word()
  }
}

export const signupHttpRequest: HttpRequest = {
  body: {
    name: faker.name,
    email: faker.internet.email(),
    password: 'any_password',
    confirmationPassword: 'any_password'
  }
}

export const signupHttpResponse: HttpResponse = ok({
  accessToken: faker.random.word()
})

export const loadSurveysHttpRequest: HttpRequest = {
  accountId: 'any_account_id'
}

export const saveSurveyResultHttpRequest = (): HttpRequest => Object.assign({}, {
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

export const mockServerError = (): HttpResponse => {
  const error = new Error()
  error.stack = faker.random.word()
  return serverError(error)
}
