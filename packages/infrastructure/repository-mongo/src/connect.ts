import mongoose from 'mongoose'

export const conn = async (): Promise<typeof mongoose> => {
  try {
    const url = process.env.DB_URL ?? ''
    if (url === '') throw new Error('DB_URL is not defined')
    return await mongoose.connect(process.env.DB_URL ?? '')
  } catch (error) {
    console.log(error)
    throw new Error('Unable to connect to database')
  }
}
