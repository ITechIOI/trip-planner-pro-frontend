import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = loginSchema.extend({
  fullName: z.string().trim().min(1, 'Full name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type AuthFormValues = LoginValues | RegisterValues
