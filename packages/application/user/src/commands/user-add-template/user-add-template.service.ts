import { type ICommandHandler } from '@domain/core'
import { type UserRepository, TaskTemplate, type Template } from '@domain/user'
import { type UserAddTemplateCommand } from './user-add-template.command'

export class UserAddTemplateService implements ICommandHandler<UserAddTemplateCommand, Template> {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(command: UserAddTemplateCommand): Promise<Template> {
    const user = await this.userRepository.getById(command.userId)
    const tasks = command.template.tasks.map((task) => new TaskTemplate(task))
    const template = user.addTemplate({ name: command.template.name, tasks })
    await this.userRepository.transaction(async () => {
      await this.userRepository.addTemplate({ user, template })
    })
    return template
  }
}
