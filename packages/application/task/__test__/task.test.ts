import { REPO_CONFIG, TEST_ID } from '@config/test/utils'
import {
  ListTasks,
  TaskCreateService,
  TaskAddLabelsService,
  TaskRemoveLabelService,
  TaskRemoveProjectService,
  TaskSetProjectService,
  TaskCreateCommand,
  TaskAddLabelCommand,
  TaskRemoveLabelCommand,
  TaskSetProjectCommand,
  TaskRemoveProjectCommand
} from '../src'
import { ValidationError } from '@domain/core'
import { Label, Project, Task, type TaskModel } from '@domain/task'
import { InMemoryTaskRepository } from '@infrastructure/repository-in-memory'

const taskConfig = REPO_CONFIG

const baseTask = {
  title: 'title',
  description: 'description',
  order: 1,
  labels: [],
  pomodoro: {
    estimated: 1
  }
}
const TASK_MODEL: TaskModel = {
  userId: TEST_ID,
  id: TEST_ID,
  title: 'title',
  description: 'description',
  order: 1,
  labels: [],
  pomodoro_actual: 0,
  pomodoro_estimated: 1,
  is_completed: false,
  project_name: null,
  createdAt: new Date(),
  updatedAt: new Date()
}

// FIXME: Check instances of Task
describe.concurrent('task', () => {
  it.concurrent('Create task', async () => {
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig
    })
    const createTask = new TaskCreateService(taskRepository)
    const task = await createTask.execute(
      new TaskCreateCommand({ task: baseTask, userId: TEST_ID })
    )
    expect(Task.isEntity(task)).toBeTruthy()
    const taskProps = task.getProps()
    expect(taskProps.title).toEqual('title')
    expect(taskProps.description).toEqual('description')
    expect(task.id).toBeTypeOf('string')
    expect(taskProps.userId).toBe(TEST_ID)
  })
  it.concurrent('Create task with project', async () => {
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig
    })
    const createTask = new TaskCreateService(taskRepository)
    const task = await createTask.execute(
      new TaskCreateCommand({
        task: { ...baseTask, project: { name: 'project' } },
        userId: TEST_ID
      })
    )
    const taskProps = task.getProps()
    expect(taskProps.project).toBeInstanceOf(Project)
    expect(taskProps.project?.value.name).toBe('project')
  })
  it.concurrent('Create task with labels', async () => {
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig
    })
    const createTask = new TaskCreateService(taskRepository)
    const task = await createTask.execute(
      new TaskCreateCommand({
        task: {
          ...baseTask,
          labels: [
            { name: 'label' },
            {
              id: TEST_ID,
              name: 'label2'
            }
          ]
        },
        userId: TEST_ID
      })
    )
    const taskProps = task.getProps()
    expect(taskProps.labels).toBeInstanceOf(Array)
    expect(taskProps.labels).toHaveLength(2)
    expect(taskProps.labels[0].value.name).toBe('label')
    expect(taskProps.labels[0]).toBeInstanceOf(Label)
    expect(taskProps.labels[1].value.name).toBe('label2')
    expect(taskProps.labels[1]).toBeInstanceOf(Label)
  })
  it.concurrent('Create task with labels and project', async () => {
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig
    })
    const createTask = new TaskCreateService(taskRepository)
    const task = await createTask.execute(
      new TaskCreateCommand({
        task: { ...baseTask, labels: [{ name: 'label' }], project: { name: 'project' } },
        userId: TEST_ID
      })
    )
    expect(Task.isEntity(task)).toBeTruthy()
    const taskProps = task.getProps()
    expect(taskProps.title).toEqual('title')
    expect(taskProps.description).toEqual('description')
    expect(task.id).toBeTypeOf('string')
    expect(taskProps.userId).toBe(TEST_ID)
    expect(taskProps.labels).toBeInstanceOf(Array)
    expect(taskProps.labels).toHaveLength(1)
    expect(taskProps.labels[0].value.name).toBe('label')
    expect(taskProps.project).toBeInstanceOf(Project)
    expect(taskProps.project?.value.name).toBe('project')
  })
  it.concurrent('Create multiple task', async () => {
    const taskRepository = new InMemoryTaskRepository(taskConfig)
    const createTask = new TaskCreateService(taskRepository)
    const tasks = await createTask.execute(
      Array.from({ length: 10 }, (_, i) => i).map(
        (i) =>
          new TaskCreateCommand({
            task: { ...baseTask, title: `test-title-${i}`, description: `test-desc-${i}` },
            userId: TEST_ID.slice(0, -1) + i
          })
      )
    )
    expect(tasks).toBeInstanceOf(Array)
    expect(tasks).toHaveLength(10)
    tasks.forEach((task, i) => {
      expect(Task.isEntity(task)).toBeTruthy()
      const taskProps = task.getProps()
      expect(taskProps.title).toBe(`test-title-${i}`)
      expect(taskProps.description).toBe(`test-desc-${i}`)
      expect(taskProps.userId).toBe(TEST_ID.slice(0, -1) + i)
      expect(task.id).toBeTypeOf('string')
    })
  })
  it.concurrent('Create multiple task with project and labels', async () => {
    const taskRepository = new InMemoryTaskRepository(taskConfig)
    const createTask = new TaskCreateService(taskRepository)
    const tasks = await createTask.execute(
      Array.from({ length: 3 }, (_, i) => i).map(
        (i) =>
          new TaskCreateCommand({
            task: {
              ...baseTask,
              title: `test-title-${i}`,
              description: `test-desc-${i}`,
              labels: [
                { name: 'label' },
                {
                  id: TEST_ID,
                  name: 'label2'
                }
              ],
              project: { name: 'project' }
            },
            userId: TEST_ID.slice(0, -1) + i
          })
      )
    )
    expect(tasks).toBeInstanceOf(Array)
    expect(tasks).toHaveLength(3)
    tasks.forEach((task, i) => {
      expect(Task.isEntity(task)).toBeTruthy()
      const taskProps = task.getProps()
      expect(taskProps.title).toBe(`test-title-${i}`)
      expect(taskProps.description).toBe(`test-desc-${i}`)
      expect(taskProps.userId).toBe(TEST_ID.slice(0, -1) + i)
      expect(task.id).toBeTypeOf('string')
      expect(taskProps.labels[0].value.name).toBe('label')
      expect(taskProps.labels[0]).toBeInstanceOf(Label)
      expect(taskProps.labels[1].value.name).toBe('label2')
      expect(taskProps.labels[1]).toBeInstanceOf(Label)
      expect(taskProps.project).toBeInstanceOf(Project)
      expect(taskProps.project?.value.name).toBe('project')
    })
  })
  it.concurrent('List task', async () => {
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig
    })
    const createTask = new TaskCreateService(taskRepository)
    await createTask.execute(
      Array.from({ length: 10 }, (_, i) => i).map(
        (i) =>
          new TaskCreateCommand({
            task: { ...baseTask, title: `test-title-${i}`, description: `test-desc-${i}` },
            userId: TEST_ID.slice(0, -1) + i
          })
      )
    )
    const listTasks = new ListTasks(taskRepository)
    const tasks = await listTasks.getAll()
    expect(tasks).toBeInstanceOf(Array)
    expect(tasks).toHaveLength(10)
    tasks.forEach((task, i) => {
      expect(Task.isEntity(task)).toBeTruthy()
      const taskProps = task.getProps()
      expect(taskProps.title).toBe(`test-title-${i}`)
      expect(taskProps.description).toBe(`test-desc-${i}`)
      expect(taskProps.userId).toBe(TEST_ID.slice(0, -1) + i)
      expect(task.id).toBeTypeOf('string')
    })
  })
  it.concurrent('List task by user id', async () => {
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig
    })
    const createTask = new TaskCreateService(taskRepository)
    await Promise.all([
      await createTask.execute(
        Array.from({ length: 10 }, (_, i) => i).map(
          (i) =>
            new TaskCreateCommand({
              task: { ...baseTask, title: `test-title-${i}`, description: `test-desc-${i}` },
              userId: TEST_ID.slice(0, -1) + i
            })
        )
      ),
      createTask.execute(
        new TaskCreateCommand({
          task: { ...baseTask, title: 'test-title-10', description: 'test-desc-10' },
          userId: TEST_ID.slice(0, -1) + 0
        })
      )
    ])
    const listTasks = new ListTasks(taskRepository)
    const tasks = await listTasks.getByUserId(TEST_ID.slice(0, -1) + 0)
    expect(tasks).toBeInstanceOf(Array)
    expect(tasks).toHaveLength(2)
    const [task, task2] = tasks
    const taskP = task.getProps()
    const taskP2 = task2.getProps()
    expect(Task.isEntity(task)).toBeTruthy()
    expect(taskP.title).toBe('test-title-0')
    expect(taskP.description).toBe('test-desc-0')
    expect(taskP.userId).toBe(TEST_ID.slice(0, -1) + 0)
    expect(task.id).toBeTypeOf('string')
    expect(Task.isEntity(task2)).toBeTruthy()
    expect(taskP2.title).toBe('test-title-10')
    expect(taskP2.description).toBe('test-desc-10')
    expect(taskP2.userId).toBe(TEST_ID.slice(0, -1) + 0)
    expect(task2.id).toBeTypeOf('string')
  })
  it.concurrent('Add label to task', async () => {
    const now = new Date()
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig,
      tasks: [
        {
          ...TASK_MODEL,
          createdAt: now,
          updatedAt: now
        }
      ]
    })
    let task = await taskRepository.getTask(TEST_ID)
    expect(Task.isEntity(task)).toBeTruthy()
    expect(task.getProps().labels).toHaveLength(0)

    const addLabel = new TaskAddLabelsService(taskRepository)
    await addLabel.execute(
      new TaskAddLabelCommand({
        taskId: TEST_ID,
        label: [{ name: 'label' }]
      })
    )
    task = await taskRepository.getTask(TEST_ID)
    expect(Task.isEntity(task)).toBeTruthy()
    expect(task.getProps().labels).toHaveLength(1)
    const label = task.getProps().labels[0]
    expect(Label.isValueObject(label)).toBeTruthy()
    expect(label).toEqual(new Label({ name: 'label' }))
  })
  it.concurrent('Add labels to task', async () => {
    const now = new Date()
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig,
      tasks: [
        {
          ...TASK_MODEL,
          createdAt: now,
          updatedAt: now
        }
      ]
    })
    let task = await taskRepository.getTask(TEST_ID)
    expect(Task.isEntity(task)).toBeTruthy()
    expect(task.getProps().labels).toHaveLength(0)

    const addLabel = new TaskAddLabelsService(taskRepository)
    await addLabel.execute(
      new TaskAddLabelCommand({
        taskId: TEST_ID,
        label: [{ name: 'label' }, { name: 'label2' }]
      })
    )
    task = await taskRepository.getTask(TEST_ID)
    expect(Task.isEntity(task)).toBeTruthy()
    expect(task.getProps().labels).toHaveLength(2)
    const [label, label2] = task.getProps().labels
    expect(Label.isValueObject(label)).toBeTruthy()
    expect(label).toEqual(new Label({ name: 'label' }))
    expect(Label.isValueObject(label2)).toBeTruthy()
    expect(label2).toEqual(new Label({ name: 'label2' }))
  })
  it.concurrent('Remove label to task', async () => {
    const now = new Date()
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig,
      tasks: [
        {
          ...TASK_MODEL,
          labels: [{ name: 'label-to-remove' }, { name: 'label-rot-remove' }],
          createdAt: now,
          updatedAt: now
        }
      ]
    })
    let task = await taskRepository.getTask(TEST_ID)
    expect(Task.isEntity(task)).toBeTruthy()
    expect(task.getProps().labels).toHaveLength(2)

    const addLabel = new TaskRemoveLabelService(taskRepository)
    await addLabel.execute(
      new TaskRemoveLabelCommand({
        taskId: TEST_ID,
        labelName: 'label-to-remove'
      })
    )
    task = await taskRepository.getTask(TEST_ID)
    expect(Task.isEntity(task)).toBeTruthy()
    expect(task.getProps().labels).toHaveLength(1)
    const label = task.getProps().labels[0]
    expect(Label.isValueObject(label)).toBeTruthy()
    expect(label).toEqual(new Label({ name: 'label-rot-remove' }))
  })
  it.concurrent('Set project to task', async () => {
    const InMemoryUserRepository = new InMemoryTaskRepository({
      ...taskConfig,
      tasks: [{ ...TASK_MODEL }]
    })

    let task = await InMemoryUserRepository.getTask(TEST_ID)
    expect(Task.isEntity(task)).toBeTruthy()
    expect(task.getProps().project).toBe(null)

    const setProject = new TaskSetProjectService(InMemoryUserRepository)
    await setProject.execute(
      new TaskSetProjectCommand({
        taskId: TEST_ID,
        project: { name: 'project' }
      })
    )

    task = await InMemoryUserRepository.getTask(TEST_ID)
    expect(Project.isValueObject(task.getProps().project)).toBeTruthy()
    expect(task.getProps().project).toEqual(new Project({ name: 'project' }))
  })
  it.concurrent('Remove project to task', async () => {
    const InMemoryUserRepository = new InMemoryTaskRepository({
      ...taskConfig,
      tasks: [{ ...TASK_MODEL, project_name: 'project' }]
    })

    let task = await InMemoryUserRepository.getTask(TEST_ID)
    expect(Task.isEntity(task)).toBeTruthy()
    expect(Project.isValueObject(task.getProps().project)).toBeTruthy()
    expect(task.getProps().project).toEqual(new Project({ name: 'project' }))

    const removeProject = new TaskRemoveProjectService(InMemoryUserRepository)
    await removeProject.execute(
      new TaskRemoveProjectCommand({
        taskId: TEST_ID
      })
    )

    task = await InMemoryUserRepository.getTask(TEST_ID)
    expect(task.getProps().project).toBe(null)
  })
  describe.concurrent('Exceptions', () => {
    it.concurrent('Don`t send correct props', async () => {
      const taskRepository = new InMemoryTaskRepository(taskConfig)
      const createTask = new TaskCreateService(taskRepository)
      try {
        await createTask.execute(
          new TaskCreateCommand({
            // @ts-expect-error test
            task: {},
            userId: TEST_ID
          })
        )
        expect(true).toBe(false)
      } catch (e) {
        expect((e as ValidationError).IS_VALIDATION_ERROR).toBe(true)
        expect((e as Error).message).toBe(
          '["Title is required","Description is required","Order is required","Pomodoro is required","Labels is required"]'
        )
      }
    })
    it.concurrent('Don`t send correct types ', async () => {
      const taskRepository = new InMemoryTaskRepository(taskConfig)
      const createTask = new TaskCreateService(taskRepository)
      try {
        await createTask.execute(
          new TaskCreateCommand({
            task: {
              // @ts-expect-error test
              title: 0,
              // @ts-expect-error test
              description: 0,
              // @ts-expect-error test
              labels: 'foo',
              // @ts-expect-error test
              order: 'bar',
              project: {
                // @ts-expect-error test
                name: {}
              },
              // @ts-expect-error test
              pomodoro: 'baz'
            },
            userId: TEST_ID
          })
        )
        expect(true).toBe(false)
      } catch (e) {
        expect((e as ValidationError).IS_VALIDATION_ERROR).toBe(true)
        expect((e as Error).message).toBe(
          '["Invalid type on \'title\'. expected string, received number","Invalid type on \'description\'. expected string, received number","Invalid type on \'order\'. expected number, received string","Invalid type on \'project.name\'. expected string, received object","Invalid type on \'pomodoro\'. expected object, received string","Invalid type on \'labels\'. expected array, received string"]'
        )
      }
    })
    it.concurrent('Don`t send correct lengths', async () => {
      const taskRepository = new InMemoryTaskRepository(taskConfig)
      const createTask = new TaskCreateService(taskRepository)
      try {
        await createTask.execute(
          new TaskCreateCommand({
            task: {
              ...baseTask,
              order: -1,
              title: 't',
              description: 'd'
            },
            userId: TEST_ID
          })
        )
        expect(true).toBe(false)
      } catch (e) {
        expect((e as ValidationError).IS_VALIDATION_ERROR).toBe(true)
        expect((e as Error).message).toBe(
          '["Title should be at least 3 characters","Description should be at least 3 characters","Order should be equals or greater than 0"]'
        )
      }
    })
    it.concurrent('Don`t correct userId', async () => {
      const taskRepository = new InMemoryTaskRepository(taskConfig)
      const createTask = new TaskCreateService(taskRepository)
      try {
        await createTask.execute(
          new TaskCreateCommand({
            task: {
              ...baseTask,
              title: 'title',
              description: 'description'
            },
            userId: 'asdjkah-asldjkh'
          })
        )
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError)
        expect((e as Error).message).toBe(
          '["User ID should be a valid UUID(something like this: \'string-string-string-string-string\')"]'
        )
      }
    })
    // TODO: Check if exceptions need to be tested in [add/remove]: [Label/Template]
  })
})
