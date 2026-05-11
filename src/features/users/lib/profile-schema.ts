import { z } from 'zod'

const optionalEmailSchema = z.union([
  z.string().trim().email('Enter a valid email address'),
  z.literal(''),
])

export const profileSchema = z.object({
  fullName: z.string().trim().max(200, 'Full name must be 200 characters or fewer'),
  email: optionalEmailSchema,
  phone: z.string().trim().max(30, 'Phone must be 30 characters or fewer'),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export type ProfileAvatarAction =
  | { type: 'keep' }
  | { type: 'upload'; file: File }
  | { type: 'remove' }

export type ProfileSubmitValues = ProfileFormValues & {
  avatarAction: ProfileAvatarAction
}
