import { type ITask } from '@/domain/task'
import { Schema } from 'mongoose'
import { UserModel } from '../user/model'

export const taskSchema = new Schema<ITask>({
  title: {
    type: 'string',
    required: true
  },
  description: 'string',
  id: {
    type: 'string',
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: 'string',
    ref: UserModel
  }
})
