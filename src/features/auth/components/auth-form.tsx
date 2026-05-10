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
  hasSubmitError?: boolean
  onSubmit: (values: AuthFormValues) => void
}

export const AuthForm = ({
  mode,
  isPending = false,
  hasSubmitError = false,
  onSubmit,
}: AuthFormProps) => {
  const isRegister = mode === 'register'
  const form = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: isRegister
      ? { fullName: '', username: '', password: '' }
      : { username: '', password: '' },
  })

  return (
    <form className="form-stack" onSubmit={form.handleSubmit(onSubmit)}>
      {isRegister ? (
        <label className="field">
          <span>Full name</span>
          <input
            autoComplete="name"
            type="text"
            {...form.register('fullName' as const)}
          />
          <FieldError
            message={
              'fullName' in form.formState.errors
                ? form.formState.errors.fullName?.message
                : undefined
            }
          />
        </label>
      ) : null}

      <label className="field">
        <span>Username</span>
        <input autoComplete="username" type="text" {...form.register('username')} />
        <FieldError message={form.formState.errors.username?.message} />
      </label>

      <label className="field">
        <span>Password</span>
        <input
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          type="password"
          {...form.register('password')}
        />
        <FieldError message={form.formState.errors.password?.message} />
      </label>

      {hasSubmitError ? (
        <p className="form-error" role="alert">
          Authentication failed. Check your credentials and try again.
        </p>
      ) : null}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? 'Working...' : isRegister ? 'Create account' : 'Sign in'}
        <ArrowRight size={16} />
      </Button>
    </form>
  )
}
