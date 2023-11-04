import type { ITask, TaskRepository } from '@/domain/task'

export class ListTasks {
  constructor(private readonly taskRepository: TaskRepository) {}
  async getAll(): Promise<ITask[]> {
    return await this.taskRepository.getTasks()
  }
}
