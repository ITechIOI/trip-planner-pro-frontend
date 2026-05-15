import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Link as MuiLink, Stack, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { routePaths } from '@/app/router'
import { useRegisterAction } from '../api'
import { AuthLayout, AuthSubmitButton, AuthTextField } from '../components'
import { getRegisterErrorMessage } from '../lib'
import { signUpSchema, type SignUpFormValues } from '../schemas'

export const SignUpPage = () => {
  const navigate = useNavigate()
  const registerMutation = useRegisterAction({
    mutation: {
      onSuccess: () => {
        navigate(routePaths.dashboard, { replace: true })
      },
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      fullName: '',
      username: '',
      password: '',
    },
  })

  const onSubmit = (values: SignUpFormValues) => {
    registerMutation.mutate({
      data: values,
    })
  }

  return (
    <AuthLayout
      background="signup"
      topActionLabel="Sign In"
      topActionTo={routePaths.login}
    >
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Typography
          component="h1"
          sx={{
            mb: { xs: 2.25, md: 2.5 },
            textAlign: 'center',
            fontSize: { xs: 26, md: 32 },
            lineHeight: 1.15,
            fontWeight: 700,
          }}
        >
          Create Your Account
        </Typography>

        <Stack spacing={{ xs: 1.5, md: 1.75 }}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <AuthTextField
                {...field}
                id="signup-email"
                autoComplete="email"
                fieldLabel="Email"
                placeholder="e.g., yourname@gmail.com"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                icon={<EmailOutlinedIcon fontSize="large" />}
              />
            )}
          />

          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <AuthTextField
                {...field}
                id="signup-full-name"
                autoComplete="name"
                fieldLabel="Full Name"
                placeholder="e.g., yourfullname"
                error={Boolean(errors.fullName)}
                helperText={errors.fullName?.message}
                icon={<PersonOutlineOutlinedIcon fontSize="large" />}
              />
            )}
          />

          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <AuthTextField
                {...field}
                id="signup-username"
                autoComplete="username"
                fieldLabel="Username"
                placeholder="e.g., SIXSTAR"
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                icon={<AccountCircleOutlinedIcon fontSize="large" />}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <AuthTextField
                {...field}
                id="signup-password"
                autoComplete="new-password"
                fieldLabel="Password"
                placeholder="Minimum 8 characters"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                icon={<LockOutlinedIcon fontSize="large" />}
                isPassword
              />
            )}
          />

          {registerMutation.error ? (
            <Alert severity="error" role="alert">
              {getRegisterErrorMessage(registerMutation.error)}
            </Alert>
          ) : null}

          <AuthSubmitButton disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Registering...' : 'Register'}
          </AuthSubmitButton>
        </Stack>

        <Typography
          sx={{
            mt: 1.75,
            textAlign: 'center',
            fontSize: { xs: 14, sm: 16 },
          }}
        >
          Already have an account?{' '}
          <MuiLink component={RouterLink} to={routePaths.login} color="inherit">
            Login
          </MuiLink>
        </Typography>
      </Box>
    </AuthLayout>
  )
}
