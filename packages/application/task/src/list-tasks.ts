import type { Task, TaskRepository } from '@domain/task'

export class ListTasks {
  constructor(private readonly taskRepository: TaskRepository) {}
  async getAll(): Promise<Task[]> {
    return await this.taskRepository.getTasks()
  }

  async getByUserId(userId: string): Promise<Task[]> {
    return await this.taskRepository.getTasksByUserId(userId)
  }
}
