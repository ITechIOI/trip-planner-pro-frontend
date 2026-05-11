import { Box, Link as MuiLink, Paper, Stack, Typography } from '@mui/material'
import { Compass } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginAction, useRegisterAction } from '@/features/auth'
import { AuthForm } from '@/features/auth/components/auth-form'
import {
  getLoginErrorMessage,
  getRegisterErrorMessage,
} from '@/features/auth/lib'
import type {
  AuthFormValues,
  RegisterValues,
} from '@/features/auth/lib/auth-schemas'
import { tripPlannerColors } from '@/app/theme'
import { showErrorToast } from '@/shared/components/toast-store'

export const AuthPage = ({ mode }: { mode: 'login' | 'register' }) => {
  const navigate = useNavigate()
  const isRegister = mode === 'register'
  const loginMutation = useLoginAction({
    mutation: {
      onSuccess: () => navigate('/trips', { replace: true }),
      onError: (error) => showErrorToast(getLoginErrorMessage(error)),
    },
  })
  const registerMutation = useRegisterAction({
    mutation: {
      onSuccess: () => navigate('/trips', { replace: true }),
      onError: (error) => showErrorToast(getRegisterErrorMessage(error)),
    },
  })
  const mutation = isRegister ? registerMutation : loginMutation

  const onSubmit = (values: AuthFormValues) => {
    if (isRegister) {
      registerMutation.mutate({
        data: {
          fullName: (values as RegisterValues).fullName,
          username: values.username,
          password: values.password,
        },
      })
      return
    }

    loginMutation.mutate({
      data: {
        username: values.username,
        password: values.password,
      },
    })
  }

  return (
    <Box
      className="auth-page"
      component="main"
      sx={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100svh',
        width: 'min(1120px, calc(100% - 32px))',
        mx: 'auto',
        py: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        aria-labelledby="auth-title"
        className="auth-panel"
        component="section"
        variant="outlined"
        sx={{
          width: 'min(460px, 100%)',
          display: 'grid',
          gap: 3.5,
          p: { xs: 2.75, sm: 4 },
          borderColor: tripPlannerColors.border,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.92)',
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Stack className="auth-panel__brand" direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <Box
            aria-hidden="true"
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 42,
              height: 42,
              borderRadius: 1.5,
              color: '#FFFFFF',
              background: `linear-gradient(135deg, ${tripPlannerColors.primary}, ${tripPlannerColors.secondary})`,
            }}
          >
            <Compass size={26} />
          </Box>
          <Typography component="strong" sx={{ fontWeight: 900 }}>
            Trip Planner Pro
          </Typography>
        </Stack>

        <Box>
          <Typography component="h1" id="auth-title" variant="h1">
            {isRegister ? 'Create your travel workspace' : 'Welcome back'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Plan the itinerary, packing list, and travel budget from one calm
            workspace.
          </Typography>
        </Box>

        <AuthForm
          mode={mode}
          isPending={mutation.isPending}
          onSubmit={onSubmit}
        />

        <Typography className="auth-panel__switch" sx={{ textAlign: 'center' }}>
          {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
          <MuiLink
            component={Link}
            sx={{ color: tripPlannerColors.primaryStrong, fontWeight: 800 }}
            to={isRegister ? '/login' : '/register'}
          >
            {isRegister ? 'Sign in' : 'Create one'}
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  )
}
