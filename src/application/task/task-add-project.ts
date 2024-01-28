import { type TaskRepository } from '@/domain/task'

interface AddProjectProps {
  taskId: string
  project: { name: string }
}

export class TaskAddProject {
  constructor(private readonly taskRepository: TaskRepository) {}

  async addProject(props: AddProjectProps): Promise<void> {
    const task = await this.taskRepository.getTask(props.taskId)
    task.setProject(props.project)
    await this.taskRepository.transaction(async () => {
      await this.taskRepository.updateProject({ task })
    })
  }
}
