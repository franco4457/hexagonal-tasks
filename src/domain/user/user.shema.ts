import z from 'zod'
import { type IUserCreate } from './user.entity'
import { ValidationError } from '../core/exeptions'
import { customErrorMap } from '../core'

export const UserSchema = z.object({
  id: z.string().uuid({ message: 'Invalid id' }),
  name: z
    .string({
      required_error: 'Name is required'
    })
    .min(3, { message: 'Name should be at least 3 characters' })
    .max(50, { message: 'Name should be less than 50 characters' }),
  lastname: z
    .string({
      required_error: 'Lastname is required'
    })
    .min(3, { message: 'Lastname should be at least 3 characters' })
    .max(50, { message: 'Lastname should be less than 50 characters' }),
  username: z
    .string({
      required_error: 'Username is required'
    })
    .min(3, { message: 'Username should be at least 3 characters' })
    .max(50, { message: 'Username should be less than 50 characters' }),
  email: z
    .string({
      required_error: 'Email is required'
    })
    .email({ message: 'Email should be a string like name@mail.com' }),
  password: z
    .string({
      required_error: 'Password is required'
    })
    .min(8, { message: 'Password should be at least 8 characters' })
    .max(50, { message: 'Password should be less than 50 characters' })
    .regex(/[a-z]/, { message: 'Password should have at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password should have at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password should have at least one number' })
})

export const validateUser = async (user: unknown): Promise<IUserCreate> => {
  try {
    const result = await UserSchema.omit({ id: true }).parseAsync(user, {
      errorMap: customErrorMap
    })
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      // console.log('Validate user', error.message)
      throw new ValidationError('Invalid user', error.issues)
    }
    throw new ValidationError('Invalid user')
  }
}
