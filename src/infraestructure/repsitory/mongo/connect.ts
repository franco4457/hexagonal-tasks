import { DB_URL } from '@/config'
import mongoose from 'mongoose'

export const conn = async (): Promise<typeof mongoose> => {
  try {
    return await mongoose.connect(DB_URL)
  } catch (error) {
    console.log(error)
    throw new Error('Unable to connect to database')
  }
}
