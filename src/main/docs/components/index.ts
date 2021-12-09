import { badRequest } from './bad-request'
import { notFound } from './not-found'
import { unauthorized } from './unauthorized'
import { forbidden } from './forbidden'
import { internalServerError } from './internal-server-error'
import { securitySchemes } from './security'

export * from './request-body'
export * from './bad-request'
export * from './not-found'
export * from './unauthorized'
export * from './forbidden'
export * from './internal-server-error'
export * from './security'

export const components = {
  securitySchemes,
  badRequest,
  forbidden,
  notFound,
  unauthorized,
  internalServerError
}
