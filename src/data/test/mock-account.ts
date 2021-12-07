import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AuthenticationParams } from '@/domain/usecases/account/authentication'

export const getAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password'
})

export const getAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@email.com',
  password: 'any_password'
})
