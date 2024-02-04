import { type TaskTemplateProps, type UserRepository, TaskTemplate } from '@/domain/user'
export interface UserAddTemplateProps {
  userId: string
  template: {
    name: string
    tasks: TaskTemplateProps[]
  }
}
export class UserAddTemplate {
  constructor(private readonly userRepository: UserRepository) {}
  async addTemplate(props: UserAddTemplateProps): Promise<void> {
    const user = await this.userRepository.getById(props.userId)
    const tasks = props.template.tasks.map((task) => new TaskTemplate(task))
    const template = user.addTemplate({ name: props.template.name, tasks })
    await this.userRepository.transaction(async () => {
      await this.userRepository.addTemplate({ user, template })
    })
  }
}
