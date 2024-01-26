import { EventHandler, type Repositories } from '@/domain/core'
import { type ProjectRepository } from '@/domain/project'
import { TaskUpdateActualPomodoroEvent } from '@/domain/task'

export class ProjectAddPomodoroCountEventHandler extends EventHandler {
  static EVENT_NAME = TaskUpdateActualPomodoroEvent.name
  static repositoriesToInject = ['projectRepository' as Repositories]
  private readonly projectRepository: ProjectRepository

  constructor(props: { projectRepository: ProjectRepository }) {
    super()
    this.projectRepository = props.projectRepository
  }

  async handle(event: TaskUpdateActualPomodoroEvent): Promise<void> {
    if (event.projectName == null) return
    try {
      const project = await this.projectRepository.getByNameAndUserId({
        name: event.projectName,
        userId: event.userId
      })
      await this.projectRepository.save(project, async () => {
        await this.projectRepository.sumPomodoroCount(project.id)
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
