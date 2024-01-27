import { type TaskRepository } from '@/domain/task'

export interface TaskRemoveLabelProps {
  taskId: string
  labelName: string
}

export class TaskRemoveLabel {
  constructor(private readonly taskRepository: TaskRepository) {}
  async removeLabel(props: TaskRemoveLabelProps): Promise<void> {
    const task = await this.taskRepository.getTask(props.taskId)
    task.removeLabel(props.labelName)
    await this.taskRepository.transaction(async () => {
      await this.taskRepository.updateLabels({ task })
    })
  }
}
