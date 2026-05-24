import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  fullName: z.string().trim().min(1, 'Full name is required.'),
  username: z.string().trim().min(1, 'Username is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export type SignUpFormValues = z.infer<typeof signUpSchema>
