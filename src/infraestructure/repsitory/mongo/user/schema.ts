import type { IPrivateUser } from '@/domain/user'
import { Schema } from 'mongoose'

export const userSchema = new Schema<IPrivateUser & { _id: string }>(
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
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    name: {
      type: 'string',
      required: true
    },
    lastname: 'string',
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string'
    }
  },
  {
    _id: false
  }
)
