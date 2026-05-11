import { Box, Paper, Typography } from '@mui/material'
import { tripPlannerColors } from '@/app/theme'
import {
  useCurrentUser,
  useUpdateCurrentUserProfileAction,
  useUploadCurrentUserAvatarAction,
} from '@/features/users'
import { ProfileForm } from '@/features/users/components/profile-form'
import {
  getUploadCurrentUserAvatarErrorMessage,
  getUpdateCurrentUserProfileErrorMessage,
  type ProfileSubmitValues,
} from '@/features/users/lib'
import type { UserResponse } from '@/shared'
import { Button, ErrorState, PageHeader, Skeleton } from '@/shared/components/ui'
import { showErrorToast, showSuccessToast } from '@/shared/components/toast-store'

const emptyToNull = (value: string) => {
  const trimmedValue = value.trim()

  return trimmedValue ? trimmedValue : null
}

export const ProfilePage = () => {
  const currentUserQuery = useCurrentUser()
  const updateProfile = useUpdateCurrentUserProfileAction()
  const uploadAvatar = useUploadCurrentUserAvatarAction()
  const isPending = updateProfile.isPending || uploadAvatar.isPending
  const currentUser = currentUserQuery.data as UserResponse | undefined

  const handleSubmit = async (values: ProfileSubmitValues) => {
    const profileData = {
      fullName: values.fullName.trim(),
      email: emptyToNull(values.email),
      ...(values.avatarAction.type === 'remove' ? { avatarUrl: null } : {}),
      phone: emptyToNull(values.phone),
    }

    try {
      if (values.avatarAction.type === 'upload') {
        try {
          await updateProfile.mutateAsync({
            data: profileData,
          })
        } catch (error) {
          showErrorToast(getUpdateCurrentUserProfileErrorMessage(error))
          return
        }

        try {
          await uploadAvatar.mutateAsync({
            data: {
              file: values.avatarAction.file,
            },
          })
        } catch (error) {
          showErrorToast(getUploadCurrentUserAvatarErrorMessage(error))
          return
        }

        showSuccessToast('Profile updated.')
        return
      }

      await updateProfile.mutateAsync({
        data: profileData,
      })

      showSuccessToast('Profile updated.')
    } catch (error) {
      showErrorToast(getUpdateCurrentUserProfileErrorMessage(error))
    }
  }

  return (
    <Box
      className="page-stack profile-page"
      component="section"
      sx={{
        width: 'min(760px, 100%)',
        display: 'grid',
        gap: 2.75,
        mx: 'auto',
      }}
    >
      <PageHeader
        title="Profile"
        description="Review your account details and keep personal contact information current."
      />

      {currentUserQuery.isLoading ? <Skeleton rows={5} /> : null}

      {currentUserQuery.error ? (
        <ErrorState
          description="Profile data could not be loaded."
          action={<Button onClick={() => currentUserQuery.refetch()}>Retry</Button>}
        />
      ) : null}

      {currentUser ? (
        <Paper
          className="profile-panel"
          component="section"
          variant="outlined"
          sx={{
            display: 'grid',
            gap: 2.5,
            p: { xs: 2, sm: 3 },
            borderColor: tripPlannerColors.border,
          }}
        >
          <Box>
            <Typography component="h2" variant="h2">
              Personal information
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              Username is managed by the account system and cannot be edited here.
            </Typography>
          </Box>

          <ProfileForm
            currentUser={currentUser}
            isPending={isPending}
            key={currentUser.id ?? 'profile'}
            onSubmit={handleSubmit}
          />
        </Paper>
      ) : null}
    </Box>
  )
}
