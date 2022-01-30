import { LogControllerDecorator } from './log-controller-decorator'
import { HttpRequest } from '@/presentation/protocols'

import { ControllerSpy, LogErrorRepositorySpy } from '@/data/test'
import { mockServerError } from '@/presentation/test'

import { faker } from '@faker-js/faker'

const mockHttpRequest = (): HttpRequest => {
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

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut()

    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)

    expect(httpRequest).toEqual(controllerSpy.httpRequest)
  })

  test('Should return the same result of controller', async () => {
    const { sut, controllerSpy } = makeSut()

    const httpRequest = mockHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const serverError = mockServerError()
    controllerSpy.httpResponse = serverError

    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)

    const expected = serverError.body.stack
    expect(logErrorRepositorySpy.stack).toBe(expected)
  })
})
