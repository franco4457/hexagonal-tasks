import mongoose from 'mongoose'
import { userSchema } from './schema'

export const UserModel = mongoose.model('User', userSchema)
