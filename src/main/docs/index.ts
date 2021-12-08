import {
  loginPath,
  signUpPath,
  surveysPath
} from './paths'

import {
  badRequest,
  forbidden,
  notFound,
  unauthorized,
  serverError
} from './components'

import {
  apiKeyAuthSchema,
  accountSchema,
  errorSchema,
  loginParamsSchema,
  signupParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema
} from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do Curso do Rodrigo Manguinho para realizar enquetes entre programadores',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquete'
  }
  ],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveysPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signupParamsSchema,
    error: errorSchema,
    surveyAnswer: surveyAnswerSchema,
    survey: surveySchema,
    surveys: surveysSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    forbidden,
    notFound,
    unauthorized,
    serverError
  }
}
