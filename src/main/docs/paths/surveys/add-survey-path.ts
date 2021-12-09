import { forbidden, noContent, internalServerError, notFound } from '@/main/docs/responses'
import { requestBody, security } from '@/main/docs/components'
import { TagNames } from '@/main/docs/tags'

export const addSurvey = {
  ...security,
  tags: [TagNames.SURVEYS],
  summary: 'API para criar uma enquete',
  ...requestBody('addSurveyParams'),
  responses: {
    ...noContent,
    ...forbidden,
    ...notFound,
    ...internalServerError
  }
}
