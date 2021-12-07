import { EmailValidatorAdapter } from './email-validator-adapter'

import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('Email Validator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const email = 'invalid_email#.com'
    const isValid = sut.isValid(email)

    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = makeSut()

    const email = 'any_email@email.com'
    const isValid = sut.isValid(email)

    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    const email = 'any_email@email.com'
    sut.isValid(email)

    const expected = 'any_email@email.com'
    expect(isEmailSpy).toHaveBeenCalledWith(expected)
  })
})
