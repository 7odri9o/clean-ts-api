import { EmailValidatorAdapter } from './email-validator-adapter'

import validator from 'validator'
import { faker } from '@faker-js/faker'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const email = faker.random.word()
    const isValid = sut.isValid(email)

    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = makeSut()

    const email = faker.internet.email()
    const isValid = sut.isValid(email)

    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    const email = faker.internet.email()
    sut.isValid(email)

    const expected = email
    expect(isEmailSpy).toHaveBeenCalledWith(expected)
  })
})
