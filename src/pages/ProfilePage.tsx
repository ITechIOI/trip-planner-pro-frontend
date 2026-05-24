import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTrips } from '@/features/trips/api/use-trip-action'
import { ProfileForm } from '@/features/users/components/profile-form'
import {
  useCurrentUser,
  useUpdateCurrentUserProfileAction,
  useUploadCurrentUserAvatarAction,
} from '@/features/users/api'
import {
  getUpdateCurrentUserProfileErrorMessage,
  getUploadCurrentUserAvatarErrorMessage,
  getUsersErrorMessage,
  type ProfileSubmitValues,
} from '@/features/users/lib'
import type {
  GetCurrentUserQueryError,
  TripPageResponse,
  UpdateCurrentUserProfileMutationError,
  UpdateUserRequest,
  UploadCurrentUserAvatarMutationError,
  UserResponse,
} from '@/shared'

type Feedback = {
  severity: 'success' | 'error'
  message: string
}

const toNullableTrimmedString = (value: string) => {
  const trimmedValue = value.trim()

  return trimmedValue || null
}

const buildProfilePayload = (
  values: ProfileSubmitValues,
  currentUser: UserResponse,
): UpdateUserRequest => ({
  fullName: values.fullName.trim(),
  email: toNullableTrimmedString(values.email),
  phone: toNullableTrimmedString(values.phone),
  avatarUrl:
    values.avatarAction.type === 'remove'
      ? null
      : currentUser.avatarUrl ?? null,
})

const ProfilePageSkeleton = () => (
  <Box
    sx={{
      display: 'grid',
      gap: 3,
      gridTemplateColumns: { xs: '1fr', lg: '360px minmax(0, 1fr)' },
      alignItems: 'start',
    }}
  >
    <Skeleton height={420} variant="rounded" />
    <Skeleton height={560} variant="rounded" />
  </Box>
)

export const ProfilePage = () => {
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const currentUserQuery = useCurrentUser()
  const tripsQuery = useTrips({ offset: 0, limit: 1 })
  const updateProfile = useUpdateCurrentUserProfileAction()
  const uploadAvatar = useUploadCurrentUserAvatarAction()
  const currentUser = currentUserQuery.data as UserResponse | undefined
  const tripsPage = tripsQuery.data as TripPageResponse | undefined
  const tripCount = tripsPage?.total ?? 0
  const isSaving = updateProfile.isPending || uploadAvatar.isPending
  const profileFormKey = currentUser
    ? [
        currentUser.id ?? 'profile',
        currentUser.username ?? '',
        currentUser.fullName ?? '',
        currentUser.email ?? '',
        currentUser.phone ?? '',
        currentUser.avatarUrl ?? '',
      ].join(':')
    : 'profile'

  const handleSubmit = async (values: ProfileSubmitValues) => {
    if (!currentUser) {
      return
    }

    setFeedback(null)

    try {
      await updateProfile.mutateAsync({
        data: buildProfilePayload(values, currentUser),
      })
    } catch (error) {
      setFeedback({
        severity: 'error',
        message: getUpdateCurrentUserProfileErrorMessage(
          error as UpdateCurrentUserProfileMutationError,
        ),
      })
      return
    }

    if (values.avatarAction.type === 'upload') {
      try {
        await uploadAvatar.mutateAsync({
          data: { file: values.avatarAction.file },
        })
      } catch (error) {
        setFeedback({
          severity: 'error',
          message: `Profile details were saved, but avatar upload failed. ${getUploadCurrentUserAvatarErrorMessage(
            error as UploadCurrentUserAvatarMutationError,
          )}`,
        })
        return
      }
    }

    setFeedback({
      severity: 'success',
      message: 'Profile updated.',
    })
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background:
          'linear-gradient(135deg, #f8fbff 0%, #eef6ff 48%, #f7fbff 100%)',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 7 },
      }}
    >
      <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
        <Stack spacing={5}>
          <Stack spacing={1}>
            <Typography
              component="h1"
              sx={{
                color: '#0f172a',
                fontSize: { xs: 36, md: 44 },
                fontWeight: 900,
                lineHeight: 1.08,
              }}
            >
              Account Settings
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ fontSize: { xs: 16, md: 18 } }}
            >
              Manage your personal information and account preferences
            </Typography>
          </Stack>

          {currentUserQuery.isLoading ? (
            <ProfilePageSkeleton />
          ) : currentUserQuery.error || !currentUser ? (
            <Paper
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'rgba(148, 163, 184, 0.22)',
                borderRadius: 3,
                boxShadow: '0 22px 60px rgba(59, 130, 246, 0.10)',
                p: { xs: 3, sm: 5 },
              }}
            >
              <Stack spacing={2}>
                <Typography
                  component="h2"
                  sx={{ color: '#0f172a', fontSize: 24, fontWeight: 900 }}
                >
                  Profile data could not be loaded
                </Typography>
                <Alert
                  action={
                    <Button
                      color="inherit"
                      onClick={() => void currentUserQuery.refetch()}
                      size="small"
                    >
                      Retry
                    </Button>
                  }
                  severity="error"
                >
                  {currentUserQuery.error
                    ? getUsersErrorMessage(
                        currentUserQuery.error as GetCurrentUserQueryError,
                      )
                    : 'Profile data could not be loaded.'}
                </Alert>
              </Stack>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {feedback ? (
                <Alert severity={feedback.severity}>{feedback.message}</Alert>
              ) : null}

              <ProfileForm
                currentUser={currentUser}
                journeyCount={tripCount}
                isPending={isSaving}
                key={profileFormKey}
                onSubmit={handleSubmit}
                tripCount={tripCount}
              />
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default ProfilePage
