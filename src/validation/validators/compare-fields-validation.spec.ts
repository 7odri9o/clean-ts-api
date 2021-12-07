import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('Compare Fields Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()

    const input = {
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    }
    const error = sut.validate(input)

    const expected = new InvalidParamError('fieldToCompare')
    expect(error).toEqual(expected)
  })

  test('Should not return anything if validation succeeds', () => {
    const sut = makeSut()

    const input = {
      field: 'any_value',
      fieldToCompare: 'any_value'
    }
    const error = sut.validate(input)

    expect(error).toBeFalsy()
  })
})
