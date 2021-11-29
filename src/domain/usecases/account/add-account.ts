import { AccountModel } from '@/domain/models/account'

export type AddAccountParams = Omit<AccountModel, 'id'>

export interface AddAccount {
  add: (params: AddAccountParams) => Promise<AccountModel | null>
}
