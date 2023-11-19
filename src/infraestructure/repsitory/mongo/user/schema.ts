import { type IUser } from '@/domain/user'
import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema<IUser>({
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
})
