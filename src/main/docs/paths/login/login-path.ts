import { badRequest, unauthorized, internalServerError, notFound, ok } from '@/main/docs/responses'
import { requestBody } from '@/main/docs/components'
import { TagNames } from '@/main/docs/tags'

export const loginPath = {
  post: {
    tags: [TagNames.LOGIN],
    summary: 'API para autenticar usuário',
    ...requestBody('loginParams'),
    responses: {
      ...ok('account'),
      ...badRequest,
      ...unauthorized,
      ...notFound,
      ...internalServerError
    }
  }
}
