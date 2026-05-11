import { z } from 'zod'
import { TripMemberRole } from '@/shared'

export const tripMemberSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  role: z.enum([TripMemberRole.VIEW, TripMemberRole.EDIT]),
})

export type TripMemberFormValues = z.infer<typeof tripMemberSchema>
