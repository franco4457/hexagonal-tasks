import mongoose from 'mongoose'
import { userSchema } from './schema'

export const USER_DI_REF = 'User'
export const UserModel = mongoose.model(USER_DI_REF, userSchema)
