import { LogErrorRepository } from '../../../data/protocols/log-error-repository'

export class LogMongoRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    return new Promise(resolve => resolve())
  }
}
