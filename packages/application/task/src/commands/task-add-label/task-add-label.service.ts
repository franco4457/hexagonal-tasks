import { type ICommandHandler } from '@domain/core'
import { TaskNotFound, type TaskRepository } from '@domain/task'
import { type TaskAddLabelCommand } from './task-add-label.command'

export class TaskAddLabelsService implements ICommandHandler<TaskAddLabelCommand, void> {
  constructor(private readonly taskRepository: TaskRepository) {}
  async execute(command: TaskAddLabelCommand): Promise<void> {
    const task = await this.taskRepository.getTask(command.taskId)
    if (command.taskId == null) throw new TaskNotFound(command.taskId)
    command.label.forEach((label) => {
      task.addLabel(label)
    })
    await this.taskRepository.transaction(async () => {
      await this.taskRepository.updateLabels({ task })
    })
  }
}
