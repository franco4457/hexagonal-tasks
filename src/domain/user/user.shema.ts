import z from 'zod'
import type { UserPropsCreate } from './user.entity'
import { customErrorMap } from '../core'
import { InvalidUser } from './user.exceptions'
import { passSchema } from './value-objects'

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
  password: passSchema
})

type ValidatedUser = Omit<UserPropsCreate, 'password'> & { password: string }

export const validateUser = async (user: unknown): Promise<ValidatedUser> => {
  try {
    const result = await UserSchema.omit({ id: true }).parseAsync(user, {
      errorMap: customErrorMap
    })
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      // console.log('Validate user', error.message)
      throw new InvalidUser(error.issues)
    }
    throw new InvalidUser()
  }
}
