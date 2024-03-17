import type { TaskRepository } from '@domain/task'
import type { TaskRemoveProjectCommand } from './task-remove-project.command'
import type { ICommandHandler } from '@domain/core'

export class TaskRemoveProjectService implements ICommandHandler<TaskRemoveProjectCommand, void> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(props: TaskRemoveProjectCommand): Promise<void> {
    const task = await this.taskRepository.getTask(props.taskId)
    task.removeProject()
    await this.taskRepository.transaction(async () => {
      await this.taskRepository.updateProject({ task })
    })
  }
}
