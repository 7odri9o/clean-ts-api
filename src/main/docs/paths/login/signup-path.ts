import { badRequest, forbidden, internalServerError, notFound, ok } from '@/main/docs/responses'
import { requestBody } from '@/main/docs/components'
import { TagNames } from '@/main/docs/tags'

export const signUpPath = {
  post: {
    tags: [TagNames.LOGIN],
    summary: 'API para criar a conta de um usuário',
    ...requestBody('signUpParams'),
    responses: {
      ...ok('account'),
      ...badRequest,
      ...forbidden,
      ...notFound,
      ...internalServerError
    }
  }
}
