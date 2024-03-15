import { randomUUID } from 'crypto'
import { isEmpty } from '../guard'
import { ArgumentNotProvided } from '../exeptions'

export interface ICommandHandler<TCommmand extends Command, Result = unknown> {
  execute: (command: TCommmand) => Promise<Result>
}

export type CommandProps<T> = Omit<T, 'id' | 'metadata'> & Partial<Command>
interface CommandMetadata {
  readonly correlationId: string
  readonly causationId?: string
  readonly userId?: string
  readonly timestamp: number
}

export class Command {
  public readonly id: string
  public readonly metadata: CommandMetadata
  constructor(props: CommandProps<unknown>) {
    if (isEmpty(props)) throw new ArgumentNotProvided('Command props cannot be empty')
    this.id = randomUUID()
    this.metadata = {
      correlationId: props.metadata?.correlationId ?? randomUUID(),
      causationId: props.metadata?.causationId,
      userId: props.metadata?.userId,
      timestamp: props.metadata?.timestamp ?? Date.now()
    }
  }
}
