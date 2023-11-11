import z from 'zod'
import { type IUserCreate } from './user.entity'

export const UserSchema = z.object({
  id: z.string().uuid({ message: 'Invalid id' }),
  name: z.string(),
  lastname: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string()
})

export const validateUser = async (user: unknown): Promise<IUserCreate> => {
  try {
    const result = await UserSchema.parseAsync(user)
    return result
  } catch (error) {
    console.log('Validate user', error)
    throw new Error('Invalid user')
  }
}
