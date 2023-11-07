import { MainRouter } from './routes/index'
import { type TaskRepository } from '@/domain/task'
import { type IUserRepository } from '@/domain/user'
import express from 'express'
import { InMemoryTaskRepository, InMemoryUserRepository } from '../repsitory/in-memory'

interface IApiBuilder {
  reset: () => IApiBuilder
  setTaskRepository: (taskRepository: TaskRepository) => IApiBuilder
  setUserRepository: (userRepository: IUserRepository) => IApiBuilder
  build: () => any
}

export class ApiBuilderExpress implements IApiBuilder {
  private api: ApiExpress
  private taskRepository!: TaskRepository | null
  private userRepository!: IUserRepository | null
  constructor() {
    this.taskRepository = null
    this.userRepository = null
    this.api = new ApiExpress()
  }

  reset(): IApiBuilder {
    this.taskRepository = null
    this.userRepository = null
    this.api = new ApiExpress()
    return this
  }

  setTaskRepository(taskRepository: TaskRepository): IApiBuilder {
    this.taskRepository = taskRepository
    return this
  }

  setUserRepository(userRepository: IUserRepository): IApiBuilder {
    this.userRepository = userRepository
    return this
  }

  build(): ApiExpress {
    if (this.taskRepository == null) throw new Error('TaskRepository not set')
    if (this.userRepository == null) throw new Error('UserRepository not set')

    this.api.build(new MainRouter(this.userRepository, this.taskRepository))
    return this.api
  }
}

export class ApiExpress {
  private readonly app: ReturnType<typeof express>
  constructor() {
    this.app = express()
  }

  getInstance(): ReturnType<typeof express> {
    return this.app
  }

  build(mainRouter: MainRouter): any {
    this.app.use((req, _res, next) => {
      console.log('Request received: ', '\x1b[36m', req.method, '\x1b[35m', req.path)
      next()
    })

    this.app.use(express.json())

    this.app.use('/api/v1', mainRouter.start())
    return this.app
  }

  start(port: number | string, host: string): void {
    this.app.listen(port, () => {
      console.log('--------------------')
      console.log(`[EXPRESS] Server listen on ${host}`)
      console.log('--------------------')
    })
  }
}
export const createInMemoryApi = (): ApiExpress => {
  const apiBuilder = new ApiBuilderExpress()
  const taskRepository = new InMemoryTaskRepository()
  const userRepository = new InMemoryUserRepository()
  apiBuilder.setTaskRepository(taskRepository)
  apiBuilder.setUserRepository(userRepository)
  return apiBuilder.build()
}
