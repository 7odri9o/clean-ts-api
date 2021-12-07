import { JwtAdapter } from './jwt-adapter'

import jwt from 'jsonwebtoken'

import { throwError } from '@/infra/test'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    const token = 'any_token'
    return new Promise(resolve => resolve(token))
  },

  async verify (): Promise<string> {
    const value = 'any_value'
    return new Promise(resolve => resolve(value))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')

      const value = 'any_id'
      await sut.encrypt(value)

      const expected = {
        payload: {
          id: 'any_id'
        },
        secret: 'secret'
      }
      expect(signSpy).toHaveBeenCalledWith(expected.payload, expected.secret)
    })

    test('Should return a token on sign success', async () => {
      const sut = makeSut()

      const value = 'any_id'
      const accessToken = await sut.encrypt(value)

      const expected = 'any_token'
      expect(accessToken).toBe(expected)
    })

    test('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(throwError)

      const value = 'any_id'
      const promise = sut.encrypt(value)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')

      const token = 'any_token'
      await sut.decrypt(token)

      const expected = {
        token: 'any_token',
        secret: 'secret'
      }
      expect(verifySpy).toHaveBeenCalledWith(expected.token, expected.secret)
    })

    test('Should return a decrypted value on verify success', async () => {
      const sut = makeSut()

      const token = 'any_token'
      const value = await sut.decrypt(token)

      const expected = 'any_value'
      expect(value).toBe(expected)
    })

    test('Should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(throwError)

      const token = 'any_token'
      const promise = sut.decrypt(token)

      await expect(promise).rejects.toThrow()
    })
  })
})
