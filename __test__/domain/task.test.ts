import { ListTasks } from './../../src/application/task/list-tasks'
import { CreateTask } from '@/application/task/task-create'
import { Task } from '@/domain/task'
import {
  InMemoryTaskRepository,
  InMemoryUserRepository
} from '@/infraestructure/repository/in-memory'
import EventEmitter2 from 'eventemitter2'

const testUUID = 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a'
const testUser = {
  email: 'new@mail.com',
  username: 'newUser',
  password: '$2b$10$LW29SqaXA.1e/ruyZjyjNumC7cItPePd2guY9Eq3udPl62iep9l6u',
  name: 'new-user',
  lastname: 'user-new',
  createdAt: new Date(),
  updatedAt: new Date()
}
const userRepo = new InMemoryUserRepository({
  eventEmitter: new EventEmitter2(),
  users: [
    {
      id: testUUID,
      ...testUser
    }
  ]
})

const loadedRepo = new InMemoryUserRepository({
  eventEmitter: new EventEmitter2(),
  users: [
    ...Array.from({ length: 10 }, (_, i) => i).map((i) => ({
      id: testUUID.slice(0, -1) + i,
      ...testUser
    }))
  ]
})

describe('task', () => {
  it.concurrent('Create task', async () => {
    const taskRepository = new InMemoryTaskRepository({
      aggregates: { userRepo }
    })
    const createTask = new CreateTask(taskRepository)
    const task = await createTask.create({
      task: { title: 'title', description: 'description' },
      userId: testUUID
    })
    expect(task).toBeInstanceOf(Task)
    const taskProps = task.getProps()
    expect(taskProps.title).toEqual('title')
    expect(taskProps.description).toEqual('description')
    expect(task.id).toBeTypeOf('string')
    expect(taskProps.userId).toBe(testUUID)
  })
  it.concurrent('List task', async () => {
    const taskRepository = new InMemoryTaskRepository({ aggregates: { userRepo: loadedRepo } })
    const createTask = new CreateTask(taskRepository)
    await Promise.all(
      Array.from({ length: 10 }, (_, i) => i).map(
        async (i) =>
          await createTask.create({
            task: { title: `test-title-${i}`, description: `test-desc-${i}` },
            userId: testUUID.slice(0, -1) + i
          })
      )
    )
    const listTasks = new ListTasks(taskRepository)
    const tasks = await listTasks.getAll()
    expect(tasks).toBeInstanceOf(Array)
    expect(tasks).toHaveLength(10)
    tasks.forEach((task, i) => {
      expect(task).toBeInstanceOf(Task)
      const taskProps = task.getProps()
      expect(taskProps.title).toBe(`test-title-${i}`)
      expect(taskProps.description).toBe(`test-desc-${i}`)
      expect(taskProps.userId).toBe(testUUID.slice(0, -1) + i)
      expect(task.id).toBeTypeOf('string')
    })
  })
  it.concurrent('List task by user id', async () => {
    const taskRepository = new InMemoryTaskRepository({ aggregates: { userRepo: loadedRepo } })
    const createTask = new CreateTask(taskRepository)
    await Promise.all([
      ...Array.from({ length: 10 }, (_, i) => i).map(
        async (i) =>
          await createTask.create({
            task: { title: `test-title-${i}`, description: `test-desc-${i}` },
            userId: testUUID.slice(0, -1) + i
          })
      ),
      createTask.create({
        task: { title: 'test-title-10', description: 'test-desc-10' },
        userId: testUUID.slice(0, -1) + 0
      })
    ])
    const listTasks = new ListTasks(taskRepository)
    const tasks = await listTasks.getByUserId(testUUID.slice(0, -1) + 0)
    expect(tasks).toBeInstanceOf(Array)
    expect(tasks).toHaveLength(2)
    const [task, task2] = tasks
    const taskP = task.getProps()
    const taskP2 = task2.getProps()
    expect(task).toBeInstanceOf(Task)
    expect(taskP.title).toBe('test-title-0')
    expect(taskP.description).toBe('test-desc-0')
    expect(taskP.userId).toBe(testUUID.slice(0, -1) + 0)
    expect(task.id).toBeTypeOf('string')
    expect(task2).toBeInstanceOf(Task)
    expect(taskP2.title).toBe('test-title-10')
    expect(taskP2.description).toBe('test-desc-10')
    expect(taskP2.userId).toBe(testUUID.slice(0, -1) + 0)
    expect(task2.id).toBeTypeOf('string')
  })
  it.concurrent('should throw error when create task don`t send correct ', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    await expect(
      createTask.create({
        // @ts-expect-error test
        task: {},
        userId: testUUID
      })
    ).rejects.toThrowError('["Title is required","Description is required"]')
  })
  it('should throw error when create task don`t send correct types ', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    await expect(
      createTask.create({
        task: {
          // @ts-expect-error test
          title: 0,
          // @ts-expect-error test
          description: 0
        },
        userId: testUUID
      })
    ).rejects.toThrowError(
      '["Expected string, received number","Expected string, received number"]'
    )
  })
  it('should throw error when create task don`t send correct lengths', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    await expect(
      createTask.create({
        task: {
          title: 't',
          description: 'd'
        },
        userId: testUUID
      })
    ).rejects.toThrowError(
      '["Title should be at least 3 characters","Description should be at least 3 characters"]'
    )
  })
  it('should throw error when create task don`t incorrect userId', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    await expect(
      createTask.create({
        task: {
          title: 'title',
          description: 'description'
        },
        userId: 'asdjkah-asldjkh'
      })
    ).rejects.toThrowError(
      '["User ID should be a valid UUID(something like this: \'string-string-string-string-string\')"]'
    )
  })
})
