import { BcryptAdapter } from './bcrypt-adapter'

import bcrypt from 'bcrypt'

import { returnFalse, throwError } from '@/infra/test'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    const hash = 'any_hash'
    return new Promise(resolve => resolve(hash))
  },

  async compare (): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      const value = 'any_value'
      await sut.hash(value)

      const expected = {
        value: 'any_value',
        salt
      }
      expect(hashSpy).toHaveBeenCalledWith(expected.value, expected.salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()

      const value = 'any_value'
      const hash = await sut.hash(value)

      const expected = 'any_hash'
      expect(hash).toBe(expected)
    })

    test('Should throw if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError)

      const value = 'any_value'
      const promise = sut.hash(value)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')

      const value = 'any_value'
      const hash = 'any_hash'
      await sut.compare(value, hash)

      const expected = {
        value: 'any_value',
        hash: 'any_hash'
      }
      expect(compareSpy).toHaveBeenCalledWith(expected.value, expected.hash)
    })

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut()

      const value = 'any_value'
      const hash = 'any_hash'
      const isValid = await sut.compare(value, hash)

      expect(isValid).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(returnFalse)

      const value = 'any_value'
      const hash = 'any_hash'
      const isValid = await sut.compare(value, hash)

      expect(isValid).toBe(false)
    })

    test('Should throw if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError)

      const value = 'any_value'
      const hash = 'any_hash'
      const promise = sut.compare(value, hash)

      await expect(promise).rejects.toThrow()
    })
  })
})
