import { ValidationError } from '@/domain/core'
import {
  Label,
  Pomodoro,
  Project,
  Task,
  TaskAddLabelEvent,
  TaskCreateEvent,
  TaskFieldIsRequired,
  TaskMarkCompleted,
  TaskMarkIncompleted,
  TaskRemoveLabelEvent,
  TaskRemoveProjectEvent,
  TaskUpdateActualPomodoroEvent,
  TaskUpdateEstimatedPomodoroEvent,
  TaskUpdateProjectEvent
} from '@/domain/task'

const baseTask = {
  description: 'test',
  title: 'test',
  order: 1,
  labels: [],
  project: null,
  pomodoro: new Pomodoro({ estimated: 1, actual: 0 }),
  userId: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
  isCompleted: false
}
describe.concurrent('Task Domain', () => {
  it.concurrent('Should create a task instance', async () => {
    const props = baseTask
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
    const props = baseTask
    const task = Task.create(props)
    expect(task).toBeInstanceOf(Task)
    expect(task.id).toBeTypeOf('string')
    expect(task.getCreatedAt()).toBeInstanceOf(Date)
    expect(task.getUpdatedAt()).toBeInstanceOf(Date)
    const now = task.getCreatedAt()
    expect(task.getProps()).toStrictEqual({ ...props, createdAt: now, updatedAt: now, id: task.id })
  })

  describe.concurrent('Events', () => {
    it.concurrent('On create task', async () => {
      const task = Task.create(baseTask)
      const events = task.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TaskCreateEvent
      expect(e).toBeInstanceOf(TaskCreateEvent)
      expect(e.aggregateId).toBe(task.id)
      expect(e.title).toBe(task.getProps().title)
      expect(e.userId).toBe(task.getProps().userId)
    })
    it.concurrent('Mark completed task', async () => {
      const task = Task.create(baseTask)
      task.markCompleted()
      expect(task.getProps().isCompleted).toBe(true)
      const events = task.domainEvents
      expect(events).toHaveLength(2)
      const e = events[1] as TaskMarkCompleted
      expect(e).toBeInstanceOf(TaskMarkCompleted)
      expect(e.aggregateId).toBe(task.id)
      expect(e.userId).toBe(task.getProps().userId)
    })
    it.concurrent('Mark incompleted task', async () => {
      const props = {
        ...baseTask,
        isCompleted: true
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
    it.concurrent('Update estimated pomodoro', async () => {
      const task = Task.create(baseTask)
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
    it.concurrent('Update actual pomodoro', async () => {
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
    it.concurrent('Add label', async () => {
      const task = new Task({
        id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
        props: baseTask
      })
      const label = Label.create({ name: 'test' })
      task.addLabel(label)
      const labels = task.getProps().labels
      expect(labels).toHaveLength(1)
      expect(labels[0]).toBe(label)
      const events = task.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TaskAddLabelEvent
      expect(e).toBeInstanceOf(TaskAddLabelEvent)
      expect(e.aggregateId).toBe(task.id)
      expect(e.labelId).toBe(label.value.id)
      expect(e.userId).toBe(task.getProps().userId)
    })
    it.concurrent('Remove label', async () => {
      const label = Label.create({ name: 'test' })
      const props = {
        ...baseTask,
        labels: [label]
      }
      const task = new Task({
        id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
        props
      })
      task.removeLabel(label.value.id)
      const labels = task.getProps().labels
      expect(labels).toHaveLength(0)
      const events = task.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TaskRemoveLabelEvent
      expect(e).toBeInstanceOf(TaskRemoveLabelEvent)
      expect(e.aggregateId).toBe(task.id)
      expect(e.labelId).toBe(label.value.id)
      expect(e.userId).toBe(task.getProps().userId)
    })
    it.concurrent('Update project adding', async () => {
      const task = new Task({
        id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
        props: baseTask
      })
      expect(task.getProps().project).toBe(null)
      task.updateProject({ name: 'test' })
      const project = task.getProps().project
      expect(project).toBeInstanceOf(Project)
      expect(project?.value.name).toBe('test')
      const events = task.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TaskUpdateProjectEvent
      expect(e).toBeInstanceOf(TaskUpdateProjectEvent)
      expect(e.aggregateId).toBe(task.id)
      expect(e.projectId).toBe(project?.value.id)
      expect(e.projectName).toBe(project?.value.name)
      expect(e.userId).toBe(task.getProps().userId)
    })
    it.concurrent('Update project change', async () => {
      const project = Project.create({ name: 'test' })
      const props = {
        ...baseTask,
        project
      }
      const task = new Task({
        id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
        props
      })
      expect(task.getProps().project).toBe(project)
      const project2 = Project.create({ name: 'test2' })
      task.updateProject(project2.value)
      expect(project2).toBeInstanceOf(Project)
      expect(project2?.value.name).toBe('test2')
      expect(task.domainEvents).toHaveLength(1)
      const e = task.domainEvents[0] as TaskUpdateProjectEvent
      expect(e).toBeInstanceOf(TaskUpdateProjectEvent)
      expect(e.projectId).toBe(project2.value.id)
      expect(e.projectName).toBe(project2.value.name)
      expect(e.userId).toBe(task.getProps().userId)
    })
    it.concurrent('Remove project', async () => {
      const project = Project.create({ name: 'test' })
      const props = {
        ...baseTask,
        project
      }
      const task = new Task({
        id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
        props
      })
      expect(task.getProps().project).toBe(project)
      task.removeProject()
      expect(task.getProps().project).toBe(null)
      expect(task.domainEvents).toHaveLength(1)
      const e = task.domainEvents[0] as TaskRemoveProjectEvent
      expect(e).toBeInstanceOf(TaskRemoveProjectEvent)
      expect(e.userId).toBe(task.getProps().userId)
    })
  })
  describe.concurrent('Exceptions', () => {
    it.concurrent('Title is required', async () => {
      const props = {
        ...baseTask,
        title: ''
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
        description: ''
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
        order: undefined
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
        userId: ''
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
        isCompleted: undefined
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
    it.concurrent('Labels should be Label instance', async () => {
      const props = {
        ...baseTask,
        labels: [{}]
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
        expect(e).toBeInstanceOf(ValidationError)
        expect((e as Error).message).toBe('labels should be a Label instance')
      }
    })
    it.concurrent('Project should be Project instance', async () => {
      const props = {
        ...baseTask,
        project: {}
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
        expect(e).toBeInstanceOf(ValidationError)
        expect((e as Error).message).toBe('project should be a Project instance')
      }
    })
  })
})
