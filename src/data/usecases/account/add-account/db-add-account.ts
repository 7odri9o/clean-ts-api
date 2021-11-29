import {
  AddAccount,
  AddAccountParams,
  AccountModel,
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (params: AddAccountParams): Promise<AccountModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(params.email)
    if (account) {
      return null
    }
    const hashedPassword = await this.hasher.hash(params.password)
    const newAccount = await this.addAccountRepository.add(Object.assign({}, params, { password: hashedPassword }))
    return newAccount
  }
}
