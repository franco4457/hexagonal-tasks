import { type ICommandHandler, valdiateID } from '@/domain/core'
import { validateTask, Task, type TaskRepository } from '@/domain/task'
import { Pomodoro } from '@/domain/task/value-objects'
import { type TaskCreateCommand } from './task-create.command'

export class TaskCreateService implements ICommandHandler<TaskCreateCommand, Task | Task[]> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(props: TaskCreateCommand): Promise<Task>
  async execute(props: TaskCreateCommand[]): Promise<Task[]>
  async execute(props: TaskCreateCommand | TaskCreateCommand[]): Promise<Task | Task[]> {
    if (Array.isArray(props)) {
      const tasks = await Promise.all(
        props.map(async ({ task, ...p }) => {
          const taskInp = await validateTask(task)
          const userId = await valdiateID(p.userId, 'User ID')
          const newTask = Task.create({
            ...taskInp,
            userId,
            pomodoro: Pomodoro.create({
              estimated: task.pomodoro.estimated,
              actual: 0
            })
          })
          if (taskInp.project != null) {
            newTask.setProject(taskInp.project)
          }
          taskInp.labels.forEach((label) => {
            newTask.addLabel(label)
          })
          return newTask
        })
      )
      await this.taskRepository.transaction(async () => await this.taskRepository.create(tasks))
      return tasks
    } else {
      const { task, ...p } = props
      const taskInp = await validateTask(task)
      const userId = await valdiateID(p.userId, 'User ID')
      const newTask = Task.create({
        ...taskInp,
        userId,
        pomodoro: new Pomodoro({ estimated: task.pomodoro.estimated, actual: 0 })
      })
      if (taskInp.project != null) {
        newTask.setProject(taskInp.project)
      }
      taskInp.labels.forEach((label) => {
        newTask.addLabel(label)
      })
      await this.taskRepository.transaction(async () => await this.taskRepository.create(newTask))
      return newTask
    }
  }
}
