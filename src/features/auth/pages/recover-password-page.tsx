import { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Link as MuiLink, Stack, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { routePaths } from '@/app/router'
import { useResetPasswordByEmailAction } from '../api'
import { AuthLayout, AuthSubmitButton, AuthTextField } from '../components'
import { getResetPasswordByEmailErrorMessage } from '../lib'
import {
  recoverPasswordSchema,
  type RecoverPasswordFormValues,
} from '../schemas'

export const RecoverPasswordPage = () => {
  const navigate = useNavigate()
  const [isPasswordResetSuccessful, setIsPasswordResetSuccessful] =
    useState(false)

  const resetPasswordMutation = useResetPasswordByEmailAction({
    mutation: {
      onSuccess: () => {
        setIsPasswordResetSuccessful(true)
      },
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverPasswordFormValues>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      email: '',
      newPassword: '',
    },
  })

  const onSubmit = (values: RecoverPasswordFormValues) => {
    resetPasswordMutation.mutate({
      data: values,
    })
  }

  const goBackToLogin = () => {
    navigate(routePaths.login)
  }

  return (
    <AuthLayout
      background="login"
      topActionLabel="Sign Up"
      topActionTo={routePaths.signup}
    >
      {isPasswordResetSuccessful ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            component="h1"
            sx={{
              mb: { xs: 3, md: 3.5 },
              fontSize: { xs: 28, md: 34 },
              lineHeight: 1.15,
              fontWeight: 700,
            }}
          >
            Forgot Password
          </Typography>

          <Box
            role="status"
            aria-live="polite"
            sx={{
              width: 'min(100%, 460px)',
              mx: 'auto',
              mb: { xs: 3, md: 3.5 },
              borderRadius: 5,
              bgcolor: '#dedede',
              px: { xs: 2.5, md: 4 },
              py: { xs: 3, md: 3.5 },
            }}
          >
            <Box
              sx={{
                width: 62,
                height: 62,
                mx: 'auto',
                mb: 1.75,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                bgcolor: '#28a895',
                color: '#ffffff',
              }}
            >
              <CheckIcon sx={{ fontSize: 44 }} />
            </Box>
            <Typography
              sx={{
                mb: 1.5,
                fontSize: { xs: 22, md: 26 },
                lineHeight: 1.18,
                fontWeight: 800,
              }}
            >
              Password Reset
              <br />
              Successfully
            </Typography>
            <Typography sx={{ fontSize: { xs: 17, md: 20 }, lineHeight: 1.25 }}>
              Your password has been updated. You can now log in again.
            </Typography>
          </Box>

          <AuthSubmitButton type="button" onClick={goBackToLogin}>
            Back to login
          </AuthSubmitButton>
        </Box>
      ) : (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Typography
            component="h1"
            sx={{
              mb: { xs: 3, md: 3.5 },
              textAlign: 'center',
              fontSize: { xs: 28, md: 34 },
              lineHeight: 1.15,
              fontWeight: 700,
            }}
          >
            Forgot Password
          </Typography>

          <Stack spacing={{ xs: 2.25, md: 2.5 }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <AuthTextField
                  {...field}
                  id="recover-email"
                  autoComplete="email"
                  fieldLabel="Email Address"
                  placeholder="e.g., yourname@gmail.com"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  icon={<EmailOutlinedIcon fontSize="large" />}
                />
              )}
            />

            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <AuthTextField
                  {...field}
                  id="recover-new-password"
                  autoComplete="new-password"
                  fieldLabel="New Password"
                  placeholder="Minimum 8 characters"
                  error={Boolean(errors.newPassword)}
                  helperText={errors.newPassword?.message}
                  icon={<LockOutlinedIcon fontSize="large" />}
                  isPassword
                />
              )}
            />

            {resetPasswordMutation.error ? (
              <Alert severity="error" role="alert">
                {getResetPasswordByEmailErrorMessage(
                  resetPasswordMutation.error,
                )}
              </Alert>
            ) : null}

            <AuthSubmitButton disabled={resetPasswordMutation.isPending}>
              {resetPasswordMutation.isPending
                ? 'Resetting password...'
                : 'Reset Password'}
            </AuthSubmitButton>
          </Stack>

          <Stack spacing={0.75} sx={{ mt: 2.25, textAlign: 'center' }}>
            <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>
              Back to Login?{' '}
              <MuiLink
                component={RouterLink}
                to={routePaths.login}
                color="inherit"
              >
                Login
              </MuiLink>
            </Typography>
            <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>
              Need an account?{' '}
              <MuiLink
                component={RouterLink}
                to={routePaths.signup}
                color="inherit"
              >
                Register
              </MuiLink>
            </Typography>
          </Stack>
        </Box>
      )}
    </AuthLayout>
  )
}
