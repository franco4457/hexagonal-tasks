import { type LabelModel } from '@/domain/user'
import { Schema } from 'mongoose'

export const labelSchema = new Schema<LabelModel & { _id: string }>(
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
