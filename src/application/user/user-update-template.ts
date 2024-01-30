import { TaskTemplate, type TaskTemplateProps, type UserRepository } from '@/domain/user'

export interface UserUpdateTemplateProps {
  userId: string
  templateId: string
  newProps: {
    name: string
    tasks: TaskTemplateProps[]
  }
}

export class UserUpdateTemplate {
  constructor(private readonly userRepository: UserRepository) {}
  async updateTemplate(props: UserUpdateTemplateProps): Promise<void> {
    const user = await this.userRepository.getById(props.userId)
    const newTasks = props.newProps.tasks.map((task) => new TaskTemplate(task))
    // TODO: add custom exception
    if (newTasks.length === 0) throw new Error('Template must have at least one task')
    const newTemplate = user.updateTemplate({
      templateId: props.templateId,
      newProps: {
        name: props.newProps.name,
        tasks: newTasks
      }
    })
    await this.userRepository.transaction(async () => {
      await this.userRepository.updateTemplate({
        template: newTemplate
      })
    })
  }
}
