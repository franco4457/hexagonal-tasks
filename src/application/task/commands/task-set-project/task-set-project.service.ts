import type { ICommandHandler } from '@/domain/core'
import type { TaskRepository } from '@/domain/task'
import type { TaskSetProjectCommand } from './task-set-project.command'

export class TaskSetProjectService implements ICommandHandler<TaskSetProjectCommand, void> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: TaskSetProjectCommand): Promise<void> {
    const task = await this.taskRepository.getTask(command.taskId)
    task.setProject(command.project)
    await this.taskRepository.transaction(async () => {
      await this.taskRepository.updateProject({ task })
    })
  }
}
