import { HttpRequest } from '@/presentation/protocols'
import { faker } from '@faker-js/faker'

export const mockSignupHttpRequest = (): HttpRequest => {
  const password = faker.internet.password()
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
  }
}
