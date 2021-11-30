import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'
import { ValidationComposite } from './validation-composite'

import { mockValidation } from '@/validation/test'

type SutTypes = {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const input = {
      field: 'any_value'
    }
    const error = sut.validate(input)

    const expected = new MissingParamError('field')
    expect(error).toEqual(expected)
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const input = {
      field: 'any_value'
    }
    const error = sut.validate(input)

    const expected = new Error()
    expect(error).toEqual(expected)
  })

  test('Should not return anything if validation succeeds', () => {
    const { sut } = makeSut()

    const input = {
      field: 'any_value'
    }
    const error = sut.validate(input)

    expect(error).toBeFalsy()
  })
})
