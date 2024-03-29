import { type LabelModel } from '@domain/user'
import { Schema } from 'mongoose'

export const labelSchema = new Schema<LabelModel>(
  {
    id: {
      type: 'string',
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: 'string',
      required: true
    }
  },
  {
    timestamps: true
  }
)
