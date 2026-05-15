import { z } from 'zod'

export const recoverPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .max(200, 'Email must be at most 200 characters.')
    .email('Enter a valid email address.'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(72, 'Password must be at most 72 characters.'),
})

export type RecoverPasswordFormValues = z.infer<typeof recoverPasswordSchema>
