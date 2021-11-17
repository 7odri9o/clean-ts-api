import { adaptMiddleware } from '@/main/adapters/express-middleware-adapter'
import { makeAuthMiddlewareController } from '@/main/factories/middlewares/auth-middleware-factory'

export const adminAuth = adaptMiddleware(makeAuthMiddlewareController('admin'))
export const userAuth = adaptMiddleware(makeAuthMiddlewareController())
