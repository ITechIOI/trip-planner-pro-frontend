import { z } from 'zod'

const emailFormatSchema = z.string().email('Enter a valid email address.')

const optionalEmailSchema = z
  .string()
  .trim()
  .max(200, 'Email must be 200 characters or fewer.')
  .refine(
    (value) => value === '' || emailFormatSchema.safeParse(value).success,
    'Enter a valid email address.',
  )

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required.')
    .max(200, 'Full name must be 200 characters or fewer.'),
  email: optionalEmailSchema,
  phone: z.string().trim().max(30, 'Phone must be 30 characters or fewer.'),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export type ProfileAvatarAction =
  | { type: 'keep' }
  | { type: 'upload'; file: File }
  | { type: 'remove' }

export type ProfileSubmitValues = ProfileFormValues & {
  avatarAction: ProfileAvatarAction
}

export const acceptedAvatarMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

export const acceptedAvatarMimeTypeSet = new Set<string>(
  acceptedAvatarMimeTypes,
)

export const maxAvatarSizeBytes = 5 * 1024 * 1024
