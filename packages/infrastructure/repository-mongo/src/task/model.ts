import mongoose from 'mongoose'
import { taskSchema } from './schema'

export const TASK_DI_REF = 'Task'
export const TaskMongoModel = mongoose.model(TASK_DI_REF, taskSchema)
