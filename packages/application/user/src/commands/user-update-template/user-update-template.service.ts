import { TaskTemplate, type Template, type UserRepository } from '@domain/user'
import { type UserUpdateTemplateCommand } from './user-update-template.command'
import { type ICommandHandler } from '@domain/core'

export class UserUpdateTemplateService
  implements ICommandHandler<UserUpdateTemplateCommand, Template>
{
  constructor(private readonly userRepository: UserRepository) {}
  async execute(command: UserUpdateTemplateCommand): Promise<Template> {
    const user = await this.userRepository.getById(command.userId)
    const newTasks = command.newProps.tasks.map((task) => new TaskTemplate(task))
    const newTemplate = user.updateTemplate({
      templateId: command.templateId,
      newProps: {
        name: command.newProps.name,
        tasks: newTasks
      }
    })
    await this.userRepository.transaction(async () => {
      await this.userRepository.updateTemplate({
        user,
        template: newTemplate
      })
    })
    return newTemplate
  }
}
