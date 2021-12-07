import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '@/presentation/errors'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()

    const input = {
      name: 'any_name'
    }
    const error = sut.validate(input)

    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return anything if validation succeeds', () => {
    const sut = makeSut()

    const input = {
      field: 'any_name'
    }
    const error = sut.validate(input)

    expect(error).toBeFalsy()
  })
})
