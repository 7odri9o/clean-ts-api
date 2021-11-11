import { Validation } from '../../../presentation/helpers/validators/validation'

export class Validator implements Validation {
  validate (input: any): Error | null {
    return null
  }
}
