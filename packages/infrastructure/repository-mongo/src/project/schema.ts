import { type ProjectModel } from '@domain/project'
import { Schema } from 'mongoose'
import { USER_DI_REF } from '../user/model'

export const projectSchema = new Schema<ProjectModel & { _id: ProjectModel['id'] }>(
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
    name: {
      type: 'string',
      required: true
    },
    description: 'string',
    pomodoroCount: {
      type: Number,
      default: 0,
      required: true
    },
    userId: {
      type: 'string',
      ref: USER_DI_REF,
      required: true
    }
  },
  {
    _id: false,
    timestamps: true
  }
)
