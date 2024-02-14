import { TimerCreateOnCreateUserEventHandler } from '@/application/timer'
import { AssignTaskWhenIsCreatedEventHandler } from '@/application/user'
import { type EventHandler } from '@/domain/core'

export const eventsHandlers: Array<new (...args: any[]) => EventHandler> = [
  AssignTaskWhenIsCreatedEventHandler,
  TimerCreateOnCreateUserEventHandler
]
