import { TagNames } from '@/main/docs/tags'
import { security } from '@/main/docs/components'
import { forbidden, ok, internalServerError, notFound } from '@/main/docs/responses'

export const loadSurveyResultPath = {
  ...security,
  tags: [TagNames.SURVEYRESULTS],
  summary: 'API para o resultado de uma enquete',
  parameters: [{
    in: 'path',
    name: 'surveyId',
    required: true,
    schema: {
      type: 'string'
    },
    description: 'Survey Id to get reports'
  }],
  responses: {
    ...ok('loadSurveyResult'),
    ...forbidden,
    ...notFound,
    ...internalServerError
  }
}
