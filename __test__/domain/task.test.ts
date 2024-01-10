import {
  Pomodoro,
  Task,
  TaskMarkCompleted,
  TaskFieldIsRequired,
  TaskCreateEvent,
  TaskMarkIncompleted,
  TaskUpdateEstimatedPomodoroEvent,
  TaskUpdateActualPomodoroEvent
} from '@/domain/task'

const baseTask = {
  description: 'test',
  title: 'test',
  order: 1,
  userId: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
  isCompleted: false
}
describe.concurrent('Task Domain', () => {
  it.concurrent('Should create a task instance', async () => {
    const props = {
      ...baseTask,
      pomodoro: new Pomodoro({ estimated: 1, actual: 0 })
    }
    const task = new Task({
      id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
      props
    })
    expect(task).toBeInstanceOf(Task)
    expect(task.id).toBe('c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a')
    expect(task.getCreatedAt()).toBeInstanceOf(Date)
    expect(task.getUpdatedAt()).toBeInstanceOf(Date)
  })
  it.concurrent('Should create a task intance with create method', async () => {
    const props = {
      ...baseTask,
      pomodoro: new Pomodoro({ estimated: 1, actual: 0 })
    }
    const task = Task.create(props)
    expect(task).toBeInstanceOf(Task)
    expect(task.id).toBeTypeOf('string')
    expect(task.getCreatedAt()).toBeInstanceOf(Date)
    expect(task.getUpdatedAt()).toBeInstanceOf(Date)
    const now = task.getCreatedAt()
    expect(task.getProps()).toStrictEqual({ ...props, createdAt: now, updatedAt: now, id: task.id })
  })

  describe.concurrent('Events', () => {
    it.concurrent('should be add event on create', async () => {
      const props = {
        ...baseTask,
        pomodoro: new Pomodoro({ estimated: 1, actual: 0 })
      }
      const task = Task.create(props)
      const events = task.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TaskCreateEvent
      expect(e).toBeInstanceOf(TaskCreateEvent)
      expect(e.aggregateId).toBe(task.id)
      expect(e.title).toBe(task.getProps().title)
      expect(e.userId).toBe(task.getProps().userId)
    })
    it.concurrent('should add event on mark completed', async () => {
      const props = {
        ...baseTask,
        pomodoro: new Pomodoro({ estimated: 1, actual: 0 })
      }
      const task = Task.create(props)
      task.markCompleted()
      expect(task.getProps().isCompleted).toBe(true)
      const events = task.domainEvents
      expect(events).toHaveLength(2)
      const e = events[1] as TaskMarkCompleted
      expect(e).toBeInstanceOf(TaskMarkCompleted)
      expect(e.aggregateId).toBe(task.id)
      expect(e.userId).toBe(task.getProps().userId)
    })
    it.concurrent('should add event on mark incompleted', async () => {
      const props = {
        ...baseTask,
        isCompleted: true,
        pomodoro: new Pomodoro({ estimated: 1, actual: 0 })
      }
      const task = new Task({
        id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
        props
      })
      task.markIncompleted()
      expect(task.getProps().isCompleted).toBe(false)
      const events = task.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TaskMarkIncompleted
      expect(e).toBeInstanceOf(TaskMarkIncompleted)
      expect(e.aggregateId).toBe(task.id)
      expect(e.userId).toBe(task.getProps().userId)
    })
    it.concurrent('should add event on update estimated pomodoro', async () => {
      const props = {
        ...baseTask,
        pomodoro: new Pomodoro({ estimated: 1, actual: 0 })
      }
      const task = Task.create(props)
      task.updateEstimatedPomodoro(2)
      expect(task.getProps().pomodoro.value.estimated).toBe(2)
      const events = task.domainEvents
      expect(events).toHaveLength(2)
      const e = events[1] as TaskUpdateEstimatedPomodoroEvent
      expect(e).toBeInstanceOf(TaskUpdateEstimatedPomodoroEvent)
      expect(e.aggregateId).toBe(task.id)
      expect(task.getProps().pomodoro.value.estimated).toBe(2)
      expect(e.estimated).toBe(2)
    })
    it.concurrent('should add event on update actual pomodoro', async () => {
      const props = {
        ...baseTask,
        pomodoro: new Pomodoro({ estimated: 2, actual: 0 })
      }
      const task = Task.create(props)
      task.updateActualPomodoro()
      expect(task.getProps().pomodoro.value.actual).toBe(1)
      const events = task.domainEvents
      expect(events).toHaveLength(2)
      const e = events[1] as TaskUpdateActualPomodoroEvent
      expect(e).toBeInstanceOf(TaskUpdateActualPomodoroEvent)
      expect(e.aggregateId).toBe(task.id)
      expect(e.actual).toBe(1)
    })
  })
  describe.concurrent('Exceptions', () => {
    it.concurrent('Title is required', async () => {
      const props = {
        ...baseTask,
        title: '',
        pomodoro: new Pomodoro({ estimated: 1, actual: 0 })
      }
      try {
        Task.create(props)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(TaskFieldIsRequired)
        expect((e as Error).message).toBe('title is required')
      }
    })
    it.concurrent('Description is required', async () => {
      const props = {
        ...baseTask,
        description: '',
        pomodoro: new Pomodoro({ estimated: 1, actual: 0 })
      }
      try {
        Task.create(props)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(TaskFieldIsRequired)
        expect((e as Error).message).toBe('description is required')
      }
    })
    it.concurrent('Order is required', async () => {
      const props = {
        ...baseTask,
        order: undefined,
        pomodoro: new Pomodoro({ estimated: 1, actual: 0 })
      }
      try {
        // @ts-expect-error Testing purposes
        Task.create(props)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(TaskFieldIsRequired)
        expect((e as Error).message).toBe('order is required')
      }
    })
    it.concurrent('UserId is required', async () => {
      const props = {
        ...baseTask,
        userId: '',
        pomodoro: new Pomodoro({ estimated: 1, actual: 0 })
      }
      try {
        Task.create(props)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(TaskFieldIsRequired)
        expect((e as Error).message).toBe('userId is required')
      }
    })
    it.concurrent('IsCompleted is required', async () => {
      const props = {
        ...baseTask,
        isCompleted: undefined,
        pomodoro: new Pomodoro({ estimated: 1, actual: 0 })
      }
      try {
        // eslint-disable-next-line no-new
        new Task({
          id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
          // @ts-expect-error Testing purposes
          props
        })
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(TaskFieldIsRequired)
        expect((e as Error).message).toBe('isCompleted is required')
      }
    })
    it.concurrent('Pomodoro should be Pomodoro instance', async () => {
      const props = {
        ...baseTask,
        pomodoro: { estimated: 1, actual: 0 }
      }
      try {
        // @ts-expect-error Testing purposes
        Task.create(props)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect((e as Error).message).toBe('pomodoro should be a Pomodoro instance')
      }
    })
  })
})
