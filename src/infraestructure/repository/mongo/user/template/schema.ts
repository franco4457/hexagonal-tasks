import { type TemplateModel } from '@/domain/user'
import { Schema } from 'mongoose'

export const templateSchema = new Schema<TemplateModel & { _id: string }>(
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
    tasks: [
      {
        name: {
          type: 'string',
          required: true
        },
        description: String,
        order: {
          type: 'number',
          required: true
        },
        pomodoroEstimated: {
          type: 'number',
          required: true
        },
        projectId: {
          type: 'string',
          nullable: true
        }
      }
    ],
    createdAt: {
      type: 'date',
      required: true
    },
    updatedAt: {
      type: 'date',
      required: true
    }
  },
  {
    _id: false
  }
)
