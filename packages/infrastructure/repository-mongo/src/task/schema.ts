import { type TaskModel } from '@domain/task'
import { Schema } from 'mongoose'
import { USER_DI_REF } from '../user/model'

export const taskSchema = new Schema<TaskModel & { _id: TaskModel['id'] }>(
  {
    _id: {
      type: 'string',
      required: true,
      unique: true
    },
    id: {
      type: 'string',
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: 'string',
      required: true
    },
    is_completed: {
      type: Boolean,
      required: true
    },
    pomodoro_estimated: {
      type: Number,
      required: true
    },
    pomodoro_actual: {
      type: Number,
      required: true
    },
    description: 'string',
    order: {
      type: 'number',
      required: true
    },
    labels: [
      {
        name: {
          type: 'string',
          required: true
        }
      }
    ],
    project_name: String,
    userId: {
      type: 'string',
      ref: USER_DI_REF
    }
  },
  {
    _id: false,
    timestamps: true
  }
)
