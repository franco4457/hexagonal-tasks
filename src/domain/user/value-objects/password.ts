import { ValueObject } from '@/domain/core/ddd'
import bcrypt from 'bcrypt'
import { z } from 'zod'

export const passSchema = z
  .string({
    required_error: 'Password is required'
  })
  .min(8, { message: 'Password should be at least 8 characters' })
  .max(50, { message: 'Password should be less than 50 characters' })
  .regex(/[a-z]/, { message: 'Password should have at least one lowercase letter' })
  .regex(/[A-Z]/, { message: 'Password should have at least one uppercase letter' })
  .regex(/[0-9]/, { message: 'Password should have at least one number' })

const isValidPass = /^\$2[abxy]\$.{56}$/
export class Password extends ValueObject<string> {
  static async create(value: string): Promise<Password> {
    const data = await passSchema.parseAsync(value)
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(data, salt)
    return new Password(hashed)
  }

  protected validate(value: string): void {
    if (!isValidPass.test(value)) {
      throw new Error("Password isn't a valid hashed password")
    }
  }

  async compare(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.value)
  }
}
