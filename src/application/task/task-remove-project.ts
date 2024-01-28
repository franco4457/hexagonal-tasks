import { type TaskRepository } from '@/domain/task'

export interface RemoveProjectProps {
    taskId: string
}

export class TaskRemoveProject {
  constructor(private readonly taskRepository: TaskRepository) {}

  async removeProject(props: RemoveProjectProps): Promise<void> {
    const task = await this.taskRepository.getTask(props.taskId)
    task.removeProject()
    await this.taskRepository.transaction(async () => {
      await this.taskRepository.updateProject({ task })
    })
  }
}
