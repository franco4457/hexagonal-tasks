import { randomUUID } from 'crypto'
import { Entity, type AggregateID } from '@/domain/core'
import { type Status } from './value-objects'

export interface TimerProps {
  userId: AggregateID
  currentTaskId: AggregateID
  status: Status
  fullDuration: number
  startedAt: number
  currentDuration: number
}

export class Timer extends Entity<TimerProps> {
  public static create(props: TimerProps): Timer {
    const id = randomUUID()
    const timer = new Timer({ props, id })
    return timer
  }

  validate(): void {
    throw new Error('Method not implemented.')
  }
}
