import mongoose from 'mongoose'
import { taskSchema } from './schema'

export const TaskModel = mongoose.model('Task', taskSchema)
