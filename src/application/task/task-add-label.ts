import { TaskNotFound, type TaskRepository } from '@/domain/task'

export interface TaskAddLabelProps {
  taskId: string
  label: Array<{ name: string }>
}

export class TaskAddLabels {
  constructor(private readonly taskRepository: TaskRepository) {}
  async addLabel(props: TaskAddLabelProps): Promise<void> {
    const task = await this.taskRepository.getTask(props.taskId)
    if (props.taskId == null) throw new TaskNotFound(props.taskId)
    props.label.forEach((label) => {
      task.addLabel(label)
    })
    await this.taskRepository.transaction(async () => {
      await this.taskRepository.updateLabels({ task })
    })
  }
}
