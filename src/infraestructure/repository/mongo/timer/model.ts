import { model } from 'mongoose'
import { timerSchema } from './schema'

export const TIMER_DI_REF = 'Timer'
export const TimerMongoModel = model(TIMER_DI_REF, timerSchema)
