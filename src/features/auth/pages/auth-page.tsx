import { Compass } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginAction, useRegisterAction } from '@/features/auth'
import { AuthForm } from '@/features/auth/components/auth-form'
import type {
  AuthFormValues,
  RegisterValues,
} from '@/features/auth/lib/auth-schemas'

export const AuthPage = ({ mode }: { mode: 'login' | 'register' }) => {
  const navigate = useNavigate()
  const isRegister = mode === 'register'
  const loginMutation = useLoginAction({
    mutation: {
      onSuccess: () => navigate('/trips', { replace: true }),
    },
  })
  const registerMutation = useRegisterAction({
    mutation: {
      onSuccess: () => navigate('/trips', { replace: true }),
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
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-panel__brand">
          <span aria-hidden="true">
            <Compass size={26} />
          </span>
          <strong>Trip Planner Pro</strong>
        </div>
        <div>
          <h1 id="auth-title">
            {isRegister ? 'Create your travel workspace' : 'Welcome back'}
          </h1>
          <p>
            Plan the itinerary, packing list, and travel budget from one calm
            workspace.
          </p>
        </div>

        <AuthForm
          mode={mode}
          isPending={mutation.isPending}
          hasSubmitError={Boolean(mutation.error)}
          onSubmit={onSubmit}
        />

        <p className="auth-panel__switch">
          {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Sign in' : 'Create one'}
          </Link>
        </p>
      </section>
    </main>
  )
}
