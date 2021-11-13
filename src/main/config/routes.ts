import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path/posix'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const routesDir = path.resolve(__dirname, '..', 'routes')
  readdirSync(routesDir)
    .filter(file => !file.includes('.test.'))
    .map(async file => (await import(`../routes/${file}`)).default(router))
}
