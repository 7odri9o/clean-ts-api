import { HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'

export const authHttpRequest = (): HttpRequest => Object.assign({}, {
  headers: {
    'x-access-token': 'any_token'
  }
})

export const authenticationHttpRequest: HttpRequest = {
  body: {
    email: 'any_email@email.com',
    password: 'any_password'
  }
}

export const signupHttpRequest: HttpRequest = {
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    confirmationPassword: 'any_password'
  }
}

export const signupHttpResponse: HttpResponse = ok({
  accessToken: 'any_token'
})

export const addSurveyHttpRequest: HttpRequest = {
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  },
  accountId: 'any_account_id'
}

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

const mockServerErrorHttpResponse = (): HttpResponse => {
  const error = new Error()
  error.stack = 'any_stack'
  return serverError(error)
}

export const serverErrorHttpResponse = mockServerErrorHttpResponse()
