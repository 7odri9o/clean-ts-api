import { EmailValidation } from './email-validation'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '@/presentation/protocols'

import { mockEmailValidator, throwError } from '@/validation/test'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const input = {
      email: 'any_email@email.com'
    }
    const error = sut.validate(input)

    const expected = new InvalidParamError('email')
    expect(error).toEqual(expected)
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const input = {
      email: 'any_email@email.com'
    }
    sut.validate(input)

    const expected = 'any_email@email.com'
    expect(isValidSpy).toHaveBeenCalledWith(expected)
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(throwError)

    const isValid = sut.validate

    expect(isValid).toThrow()
  })
})
