import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, Box, FormHelperText, Stack, TextField, Typography } from '@mui/material'
import { ImagePlus, Save, Trash2 } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { tripPlannerColors } from '@/app/theme'
import type { UserResponse } from '@/shared'
import { Button, FieldError } from '@/shared/components/ui'
import {
  type ProfileAvatarAction,
  profileSchema,
  type ProfileSubmitValues,
  type ProfileFormValues,
} from '@/features/users/lib/profile-schema'

type ProfileFormProps = {
  currentUser?: UserResponse
  isPending?: boolean
  onSubmit: (values: ProfileSubmitValues) => void
}

const toFormValues = (currentUser?: UserResponse): ProfileFormValues => ({
  fullName: currentUser?.fullName ?? '',
  email: currentUser?.email ?? '',
  phone: currentUser?.phone ?? '',
})

const acceptedAvatarTypes = new Set(['image/png', 'image/jpeg'])
const maxAvatarSizeBytes = 5 * 1024 * 1024

const getInitials = (name?: string, username?: string) => {
  const source = name?.trim() || username?.trim() || 'User'
  const initials = source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return initials || 'U'
}

export const ProfileForm = ({
  currentUser,
  isPending = false,
  onSubmit,
}: ProfileFormProps) => {
  const avatarInputId = useId()
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const [avatarAction, setAvatarAction] = useState<ProfileAvatarAction>({
    type: 'keep',
  })
  const [avatarError, setAvatarError] = useState<string>()
  const [selectedAvatarPreviewUrl, setSelectedAvatarPreviewUrl] = useState('')
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: toFormValues(currentUser),
  })

  useEffect(() => {
    form.reset(toFormValues(currentUser))
  }, [currentUser, form])

  useEffect(() => {
    return () => {
      if (selectedAvatarPreviewUrl) {
        URL.revokeObjectURL(selectedAvatarPreviewUrl)
      }
    }
  }, [selectedAvatarPreviewUrl])

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    if (!acceptedAvatarTypes.has(file.type)) {
      setAvatarAction({ type: 'keep' })
      setSelectedAvatarPreviewUrl('')
      setAvatarError('Choose a PNG or JPG image for your avatar.')
      return
    }

    if (file.size > maxAvatarSizeBytes) {
      setAvatarAction({ type: 'keep' })
      setSelectedAvatarPreviewUrl('')
      setAvatarError('Avatar image must be 5MB or smaller.')
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setSelectedAvatarPreviewUrl(previewUrl)
    setAvatarAction({ type: 'upload', file })
    setAvatarError(undefined)
  }

  const removeAvatar = () => {
    setAvatarAction({ type: 'remove' })
    setSelectedAvatarPreviewUrl('')
    setAvatarError(undefined)
  }

  const submitForm = (values: ProfileFormValues) => {
    if (avatarError) {
      return
    }

    onSubmit({
      ...values,
      avatarAction,
    })
  }
  const avatarPreviewUrl =
    avatarAction.type === 'upload'
      ? selectedAvatarPreviewUrl
      : avatarAction.type === 'remove'
        ? ''
        : currentUser?.avatarUrl ?? ''

  return (
    <Box
      className="form-stack"
      component="form"
      noValidate
      onSubmit={form.handleSubmit(submitForm)}
      sx={{ display: 'grid', gap: 2 }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          alignItems: { xs: 'flex-start', sm: 'center' },
          border: `1px solid ${tripPlannerColors.border}`,
          borderRadius: 2,
          p: 2,
        }}
      >
        <Avatar
          alt={currentUser?.fullName || currentUser?.username || 'User'}
          src={avatarPreviewUrl || undefined}
          sx={{
            width: 84,
            height: 84,
            bgcolor: tripPlannerColors.primaryStrong,
            color: '#FFFFFF',
            fontSize: 24,
            fontWeight: 900,
          }}
        >
          {getInitials(currentUser?.fullName, currentUser?.username)}
        </Avatar>
        <Box sx={{ display: 'grid', gap: 1, minWidth: 0 }}>
          <Box>
            <Typography sx={{ fontWeight: 900 }}>Avatar</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13, mt: 0.25 }}>
              Choose a PNG or JPG image. Maximum size is 5MB.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Button
              disabled={isPending}
              onClick={() => avatarInputRef.current?.click()}
              type="button"
            >
              <ImagePlus size={16} />
              Choose image
            </Button>
            <Box
              accept="image/png,image/jpeg"
              aria-label="Choose avatar image"
              component="input"
              id={avatarInputId}
              onChange={handleAvatarChange}
              ref={avatarInputRef}
              sx={{
                position: 'absolute',
                width: 1,
                height: 1,
                overflow: 'hidden',
                clip: 'rect(0 0 0 0)',
                clipPath: 'inset(50%)',
                whiteSpace: 'nowrap',
              }}
              tabIndex={-1}
              type="file"
            />
            {(avatarPreviewUrl || avatarAction.type === 'upload') ? (
              <Button
                disabled={isPending}
                onClick={removeAvatar}
                type="button"
                variant="danger"
              >
                <Trash2 size={16} />
                Remove avatar
              </Button>
            ) : null}
          </Stack>
          {avatarError ? (
            <FormHelperText error>{avatarError}</FormHelperText>
          ) : null}
        </Box>
      </Stack>

      <TextField
        label="Username"
        slotProps={{ htmlInput: { readOnly: true } }}
        value={currentUser?.username ?? ''}
      />

      <TextField
        autoComplete="name"
        error={Boolean(form.formState.errors.fullName)}
        helperText={<FieldError message={form.formState.errors.fullName?.message} />}
        label="Full name"
        {...form.register('fullName')}
      />

      <TextField
        autoComplete="email"
        error={Boolean(form.formState.errors.email)}
        helperText={<FieldError message={form.formState.errors.email?.message} />}
        label="Email"
        type="email"
        {...form.register('email')}
      />

      <TextField
        autoComplete="tel"
        error={Boolean(form.formState.errors.phone)}
        helperText={<FieldError message={form.formState.errors.phone?.message} />}
        label="Phone"
        type="tel"
        {...form.register('phone')}
      />

      <Stack
        className="form-actions"
        direction="row"
        spacing={1.25}
        sx={{ justifyContent: 'flex-end', pt: 1 }}
      >
        <Button disabled={isPending} type="submit" variant="primary">
          <Save size={16} />
          {isPending ? 'Saving...' : 'Save profile'}
        </Button>
      </Stack>
    </Box>
  )
}
