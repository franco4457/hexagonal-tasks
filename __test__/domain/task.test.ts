import { TEST_ID } from './../utils/constants'
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
  TaskSetProjectEvent
} from '@/domain/task'

const baseTask = {
  description: 'test',
  title: 'test',
  order: 1,
  labels: [],
  project: null,
  pomodoro: new Pomodoro({ estimated: 1, actual: 0 }),
  userId: TEST_ID,
  isCompleted: false
}
describe.concurrent('Task Domain', () => {
  it.concurrent('Should create a task instance', async () => {
    const props = baseTask
    const task = new Task({
      id: TEST_ID,
      props
    })
    expect(task).toBeInstanceOf(Task)
    expect(task.id).toBe(TEST_ID)
    expect(task.createdAt).toBeInstanceOf(Date)
    expect(task.updatedAt).toBeInstanceOf(Date)
  })
  it.concurrent('Should create a task intance with create method', async () => {
    const props = baseTask
    const task = Task.create(props)
    expect(task).toBeInstanceOf(Task)
    expect(task.id).toBeTypeOf('string')
    expect(task.createdAt).toBeInstanceOf(Date)
    expect(task.updatedAt).toBeInstanceOf(Date)
    const now = task.createdAt
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
        id: TEST_ID,
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
        id: TEST_ID,
        props: baseTask
      })

      task.addLabel({ name: 'test' })
      task.addLabel({ name: 'test2' })
      const labels = task.getProps().labels
      expect(labels).toHaveLength(2)
      expect(labels[0]).toBeInstanceOf(Label)
      expect(labels[0].value.name).toBe('test')
      expect(labels[1]).toBeInstanceOf(Label)
      expect(labels[1].value.name).toBe('test2')
      const events = task.domainEvents
      expect(events).toHaveLength(2)
      const [e, e2] = events as TaskAddLabelEvent[]
      expect(e).toBeInstanceOf(TaskAddLabelEvent)
      expect(e.aggregateId).toBe(task.id)
      expect(e.userId).toBe(task.getProps().userId)
      expect(e2).toBeInstanceOf(TaskAddLabelEvent)
      expect(e2.aggregateId).toBe(task.id)
      expect(e2.userId).toBe(task.getProps().userId)
    })
    it.concurrent('Remove label', async () => {
      const label = new Label({ name: 'test' })
      const props = {
        ...baseTask,
        labels: [label]
      }
      const task = new Task({
        id: TEST_ID,
        props
      })
      task.removeLabel(label.value.name)
      const labels = task.getProps().labels
      expect(labels).toHaveLength(0)
      const events = task.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TaskRemoveLabelEvent
      expect(e).toBeInstanceOf(TaskRemoveLabelEvent)
      expect(e.aggregateId).toBe(task.id)
      expect(e.userId).toBe(task.getProps().userId)
    })
    it.concurrent('Set project adding', async () => {
      const task = new Task({
        id: TEST_ID,
        props: baseTask
      })
      expect(task.getProps().project).toBe(null)
      task.setProject({ name: 'test' })
      const project = task.getProps().project
      expect(project).toBeInstanceOf(Project)
      expect(project?.value.name).toBe('test')
      const events = task.domainEvents
      expect(events).toHaveLength(1)
      const e = events[0] as TaskSetProjectEvent
      expect(e).toBeInstanceOf(TaskSetProjectEvent)
      expect(e.aggregateId).toBe(task.id)
      expect(e.projectName).toBe(project?.value.name)
      expect(e.userId).toBe(task.getProps().userId)
    })
    it.concurrent('Set project change', async () => {
      const project = new Project({ name: 'test' })
      const props = {
        ...baseTask,
        project
      }
      const task = new Task({
        id: TEST_ID,
        props
      })
      expect(task.getProps().project).toBe(project)
      const project2 = Project.create({ name: 'test2' })
      task.setProject(project2.value)
      expect(project2).toBeInstanceOf(Project)
      expect(project2?.value.name).toBe('test2')
      expect(task.domainEvents).toHaveLength(1)
      const e = task.domainEvents[0] as TaskSetProjectEvent
      expect(e).toBeInstanceOf(TaskSetProjectEvent)
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
        id: TEST_ID,
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
          id: TEST_ID,
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
          id: TEST_ID,
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
          id: TEST_ID,
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
