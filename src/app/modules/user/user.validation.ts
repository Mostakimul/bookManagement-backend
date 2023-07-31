import { z } from 'zod'
import { USER_ROLE } from './user.constant'

const updateUserZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    role: z.enum([...USER_ROLE] as [string, ...string[]]).optional(),
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    email: z.string().optional(),
  }),
})

export const UserValidation = {
  updateUserZodSchema,
}
