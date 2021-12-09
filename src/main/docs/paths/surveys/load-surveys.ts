import { forbidden, internalServerError, notFound, ok } from '@/main/docs/responses'
import { security } from '@/main/docs/components'
import { TagNames } from '@/main/docs/tags'

export const loadSurveys = {
  ...security,
  tags: [TagNames.SURVEYS],
  summary: 'API para listar todas as enquetes',
  responses: {
    ...ok('surveys'),
    ...forbidden,
    ...notFound,
    ...internalServerError
  }
}
