import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import { useForm } from 'react-hook-form'
import type { UserResponse } from '@/shared'
import {
  acceptedAvatarMimeTypeSet,
  acceptedAvatarMimeTypes,
  maxAvatarSizeBytes,
  profileSchema,
  type ProfileAvatarAction,
  type ProfileFormValues,
  type ProfileSubmitValues,
} from '@/features/users/lib/profile-schema'

export type ProfileFormProps = {
  currentUser?: UserResponse
  isPending?: boolean
  journeyCount?: number
  onSubmit: (values: ProfileSubmitValues) => void | Promise<void>
  tripCount?: number
}

const visuallyHiddenInputStyles: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
}

const toFormValues = (currentUser?: UserResponse): ProfileFormValues => ({
  fullName: currentUser?.fullName ?? '',
  email: currentUser?.email ?? '',
  phone: currentUser?.phone ?? '',
})

const getInitials = (name?: string | null, username?: string | null) => {
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
  journeyCount = 0,
  onSubmit,
  tripCount = 0,
}: ProfileFormProps) => {
  const avatarInputId = useId()
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const [avatarAction, setAvatarAction] = useState<ProfileAvatarAction>({
    type: 'keep',
  })
  const [avatarError, setAvatarError] = useState('')
  const [selectedAvatarPreviewUrl, setSelectedAvatarPreviewUrl] = useState('')
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: toFormValues(currentUser),
  })
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = form

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

    if (!acceptedAvatarMimeTypeSet.has(file.type)) {
      setAvatarAction({ type: 'keep' })
      setSelectedAvatarPreviewUrl('')
      setAvatarError('Choose a JPG, PNG, or WebP image for your avatar.')
      return
    }

    if (file.size > maxAvatarSizeBytes) {
      setAvatarAction({ type: 'keep' })
      setSelectedAvatarPreviewUrl('')
      setAvatarError('Avatar image must be 5MB or smaller.')
      return
    }

    setSelectedAvatarPreviewUrl(URL.createObjectURL(file))
    setAvatarAction({ type: 'upload', file })
    setAvatarError('')
  }

  const removeAvatar = () => {
    setAvatarAction({ type: 'remove' })
    setSelectedAvatarPreviewUrl('')
    setAvatarError('')
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
  const hasAvatar = Boolean(avatarPreviewUrl || currentUser?.avatarUrl)
  const displayName =
    currentUser?.fullName?.trim() || currentUser?.username?.trim() || 'Traveler'
  const displayEmail = currentUser?.email?.trim() || 'No email added'
  const displayPhone = currentUser?.phone?.trim() || 'No phone added'
  const displayUsername = currentUser?.username?.trim() || 'No username'
  const submitDisabled = isPending || Boolean(avatarError)

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(submitForm)}
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', lg: '360px minmax(0, 1fr)' },
        alignItems: 'start',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'rgba(148, 163, 184, 0.22)',
          borderRadius: 3,
          boxShadow: '0 22px 60px rgba(59, 130, 246, 0.10)',
          p: { xs: 3, sm: 4 },
        }}
      >
        <Stack spacing={3} sx={{ alignItems: 'stretch' }}>
          <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                alt={displayName}
                src={avatarPreviewUrl || undefined}
                sx={{
                  width: 112,
                  height: 112,
                  bgcolor: '#4f6df5',
                  color: '#fff',
                  fontSize: 34,
                  fontWeight: 900,
                  boxShadow: '0 20px 40px rgba(79, 109, 245, 0.28)',
                }}
              >
                {getInitials(currentUser?.fullName, currentUser?.username)}
              </Avatar>
              <Box
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  right: 8,
                  bottom: 12,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  bgcolor: '#19d66b',
                  border: '4px solid #fff',
                  boxShadow: '0 8px 20px rgba(25, 214, 107, 0.34)',
                }}
              />
            </Box>

            <Box>
              <Typography
                component="h2"
                sx={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}
              >
                {displayName}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Trip Planner Member
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Stack
            direction="row"
            spacing={3}
            sx={{ justifyContent: 'center', textAlign: 'center' }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ color: '#3b5bdb', fontSize: 28, fontWeight: 900 }}
              >
                {tripCount}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                Trips Planned
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ color: '#3b5bdb', fontSize: 28, fontWeight: 900 }}
              >
                {journeyCount}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                Journeys
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <ProfileContactRow
              icon={<EmailOutlinedIcon fontSize="small" />}
              value={displayEmail}
            />
            <ProfileContactRow
              icon={<LocalPhoneOutlinedIcon fontSize="small" />}
              value={displayPhone}
            />
            <ProfileContactRow
              icon={<BadgeOutlinedIcon fontSize="small" />}
              value={displayUsername}
            />
          </Stack>
        </Stack>
      </Paper>

      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'rgba(148, 163, 184, 0.22)',
            borderRadius: 3,
            boxShadow: '0 22px 60px rgba(59, 130, 246, 0.10)',
            p: { xs: 3, sm: 4 },
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
              }}
            >
              <Typography
                component="h2"
                sx={{ color: '#0f172a', fontSize: 24, fontWeight: 900 }}
              >
                Personal Information
              </Typography>
              <Button
                disabled={submitDisabled}
                startIcon={<SaveOutlinedIcon />}
                type="submit"
                variant="contained"
              >
                {isPending ? 'Saving...' : 'Save profile'}
              </Button>
            </Stack>

            <TextField
              autoComplete="name"
              error={Boolean(errors.fullName)}
              fullWidth
              helperText={errors.fullName?.message}
              label="Full name"
              slotProps={{
                input: {
                  startAdornment: (
                    <PersonOutlineOutlinedIcon
                      color="action"
                      sx={{ mr: 1, fontSize: 20 }}
                    />
                  ),
                },
              }}
              {...register('fullName')}
            />

            <TextField
              autoComplete="email"
              error={Boolean(errors.email)}
              fullWidth
              helperText={errors.email?.message}
              label="Email address"
              slotProps={{
                input: {
                  startAdornment: (
                    <EmailOutlinedIcon
                      color="action"
                      sx={{ mr: 1, fontSize: 20 }}
                    />
                  ),
                },
              }}
              type="email"
              {...register('email')}
            />

            <TextField
              autoComplete="tel"
              error={Boolean(errors.phone)}
              fullWidth
              helperText={errors.phone?.message}
              label="Phone number"
              slotProps={{
                input: {
                  startAdornment: (
                    <LocalPhoneOutlinedIcon
                      color="action"
                      sx={{ mr: 1, fontSize: 20 }}
                    />
                  ),
                },
              }}
              type="tel"
              {...register('phone')}
            />

            <Divider />

            <Stack spacing={2}>
              <Box>
                <Typography
                  component="h3"
                  sx={{ color: '#0f172a', fontSize: 20, fontWeight: 900 }}
                >
                  Profile Photo
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Choose a JPG, PNG, or WebP image. Maximum size is 5MB.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                <Button
                  aria-controls={avatarInputId}
                  disabled={isPending}
                  onClick={() => avatarInputRef.current?.click()}
                  startIcon={<PhotoCameraOutlinedIcon />}
                  type="button"
                  variant="outlined"
                >
                  Choose image
                </Button>
                <input
                  accept={acceptedAvatarMimeTypes.join(',')}
                  aria-label="Choose avatar image"
                  id={avatarInputId}
                  onChange={handleAvatarChange}
                  ref={avatarInputRef}
                  style={visuallyHiddenInputStyles}
                  tabIndex={-1}
                  type="file"
                />
                {hasAvatar || avatarAction.type === 'upload' ? (
                  <Button
                    color="error"
                    disabled={isPending}
                    onClick={removeAvatar}
                    startIcon={<DeleteOutlinedIcon />}
                    type="button"
                    variant="outlined"
                  >
                    Remove avatar
                  </Button>
                ) : null}
              </Stack>

              {avatarAction.type === 'remove' ? (
                <FormHelperText>
                  Avatar will be removed after saving the profile.
                </FormHelperText>
              ) : null}
              {avatarAction.type === 'upload' ? (
                <FormHelperText>
                  Selected avatar will be uploaded after saving the profile.
                </FormHelperText>
              ) : null}
              {avatarError ? (
                <FormHelperText error>{avatarError}</FormHelperText>
              ) : null}
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}

type ProfileContactRowProps = {
  icon: ReactNode
  value: string
}

const ProfileContactRow = ({ icon, value }: ProfileContactRowProps) => (
  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
    <Box
      aria-hidden="true"
      sx={{
        width: 32,
        height: 32,
        borderRadius: 2,
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'rgba(79, 109, 245, 0.10)',
        color: '#4f6df5',
        flex: '0 0 auto',
      }}
    >
      {icon}
    </Box>
    <Typography color="text.secondary" sx={{ minWidth: 0 }} noWrap>
      {value}
    </Typography>
  </Stack>
)
