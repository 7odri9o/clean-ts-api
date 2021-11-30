import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { addAccountParams, accessToken, roleAdmin } from './account-params'

export const getAddAccountParams = (): AddAccountParams => addAccountParams

export const mockAccountWithToken: any = Object.assign({}, addAccountParams, accessToken)

export const mockAccountWithTokenAndRoleAdmin: any = Object.assign({}, addAccountParams, accessToken, roleAdmin)
