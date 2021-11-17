import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthMiddlewareController } from '../factories/middlewares/auth-middleware-factory'

export const adminAuth = adaptMiddleware(makeAuthMiddlewareController('admin'))
export const userAuth = adaptMiddleware(makeAuthMiddlewareController())
