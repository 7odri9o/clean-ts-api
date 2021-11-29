import { AddAccountParams } from '@/domain/usecases/account/add-account'

export const getAddAccountParams = (): AddAccountParams => ({
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

export const mockAccountWithToken: any = Object.assign({}, getAddAccountParams(), {
  accessToken: 'any_token'
})

export const mockAccountWithTokenAndRoleAdmin: any = Object.assign({}, getAddAccountParams(), {
  accessToken: 'any_token',
  role: 'admin'
})
