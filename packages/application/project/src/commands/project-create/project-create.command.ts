import { Command, type CommandProps } from '@domain/core'

export class ProjectCreateCommand extends Command {
  readonly name: string
  readonly userId: string
  constructor(props: CommandProps<ProjectCreateCommand>) {
    super(props)
    this.name = props.name
    this.userId = props.userId
  }
}
