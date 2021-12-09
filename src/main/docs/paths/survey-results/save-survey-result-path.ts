import { TagNames } from '@/main/docs/tags'
import { requestBody, security } from '@/main/docs/components'
import { forbidden, ok, internalServerError, notFound } from '@/main/docs/responses'

export const saveSurveyResultPath = {
  ...security,
  tags: [TagNames.SURVEYRESULTS],
  summary: 'API para salvar resposta em uma enquete',
  parameters: [{
    in: 'path',
    name: 'surveyId',
    required: true,
    schema: {
      type: 'string'
    },
    description: 'Survey Id to answer'
  }],
  ...requestBody('saveSurveyResult'),
  responses: {
    ...ok('surveyResult'),
    ...forbidden,
    ...notFound,
    ...internalServerError
  }
}
