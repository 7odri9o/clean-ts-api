import { badRequest } from './bad-request'
import { notFound } from './not-found'
import { unauthorized } from './unauthorized'
import { forbidden } from './forbidden'
import { serverError } from './server-error'
import { securitySchemes } from './security'

export const components = {
  securitySchemes,
  badRequest,
  forbidden,
  notFound,
  unauthorized,
  serverError
}
