import { Stack, TextField } from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import {
  type AuthFormValues,
  type LoginValues,
  loginSchema,
  type RegisterValues,
  registerSchema,
} from '@/features/auth/lib/auth-schemas'
import { Button, FieldError } from '@/shared/components/ui'

type AuthFormProps = {
  mode: 'login' | 'register'
  isPending?: boolean
  onSubmit: (values: AuthFormValues) => void
}

export const AuthForm = ({
  mode,
  isPending = false,
  onSubmit,
}: AuthFormProps) => {
  const isRegister = mode === 'register'
  const form = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: isRegister
      ? { fullName: '', username: '', password: '' }
      : { username: '', password: '' },
  })
  const fullNameError =
    'fullName' in form.formState.errors
      ? form.formState.errors.fullName?.message
      : undefined

  return (
    <Stack
      className="form-stack"
      component="form"
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      spacing={2}
    >
      {isRegister ? (
        <TextField
          autoComplete="name"
          error={Boolean(fullNameError)}
          helperText={<FieldError message={fullNameError} />}
          label="Full name"
          type="text"
          {...form.register('fullName' as const)}
        />
      ) : null}

      <TextField
        autoComplete="username"
        error={Boolean(form.formState.errors.username)}
        helperText={<FieldError message={form.formState.errors.username?.message} />}
        label="Username"
        type="text"
        {...form.register('username')}
      />

      <TextField
        autoComplete={isRegister ? 'new-password' : 'current-password'}
        error={Boolean(form.formState.errors.password)}
        helperText={<FieldError message={form.formState.errors.password?.message} />}
        label="Password"
        type="password"
        {...form.register('password')}
      />

      <Button disabled={isPending} type="submit" variant="primary">
        {isPending ? 'Working...' : isRegister ? 'Create account' : 'Sign in'}
        <ArrowRight size={16} />
      </Button>
    </Stack>
  )
}
