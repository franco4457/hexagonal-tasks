import { type TaskRepository } from '@/domain/task'
import { type TaskRemoveLabelCommand } from './task-remove-label.command'
import { type ICommandHandler } from '@/domain/core'

export class TaskRemoveLabelService implements ICommandHandler<TaskRemoveLabelCommand, void> {
  constructor(private readonly taskRepository: TaskRepository) {}
  async execute(props: TaskRemoveLabelCommand): Promise<void> {
    const task = await this.taskRepository.getTask(props.taskId)
    task.removeLabel(props.labelName)
    await this.taskRepository.transaction(async () => {
      await this.taskRepository.updateLabels({ task })
    })
  }
}
