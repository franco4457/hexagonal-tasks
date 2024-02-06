import { type TaskRepository } from '@/domain/task'

interface SetProjectProps {
  taskId: string
  project: { name: string }
}

export class TaskSetProject {
  constructor(private readonly taskRepository: TaskRepository) {}

  async setProject(props: SetProjectProps): Promise<void> {
    const task = await this.taskRepository.getTask(props.taskId)
    task.setProject(props.project)
    await this.taskRepository.transaction(async () => {
      await this.taskRepository.updateProject({ task })
    })
  }
}
