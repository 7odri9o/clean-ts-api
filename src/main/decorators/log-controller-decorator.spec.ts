import { LogControllerDecorator } from './log-controller-decorator'
import { Controller } from '@/presentation/protocols'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

import { mockController } from '@/main/test'
import { mockLogErrorRepository } from '@/data/test'
import { signupHttpRequest, signupHttpResponse, serverErrorHttpResponse } from '@/presentation/test'

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = signupHttpRequest
    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of controller', async () => {
    const { sut } = makeSut()

    const controllerHttpResponse = signupHttpResponse
    const httpResponse = await sut.handle(controllerHttpResponse)

    expect(httpResponse).toEqual(signupHttpResponse)
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverErrorHttpResponse)

    const httpRequest = signupHttpRequest
    await sut.handle(httpRequest)

    const expected = 'any_stack'
    expect(logSpy).toHaveBeenCalledWith(expected)
  })
})
