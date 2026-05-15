import type {
  LoginMutationError,
  RegisterMutationError,
  ResetPasswordByEmailMutationError,
} from '@/shared'
import { getApiErrorMessage } from '@/shared/api'

export const getLoginErrorMessage = (error: LoginMutationError) => {
  return getApiErrorMessage(error, {
    400: 'Invalid login information.',
    401: 'Incorrect username or password.',
    default: 'Unable to log in. Please try again later.',
  })
}

export const getRegisterErrorMessage = (error: RegisterMutationError) => {
  return getApiErrorMessage(error, {
    400: 'Invalid registration information.',
    409: 'Email is already in use.',
    default: 'Unable to register. Please try again later.',
  })
}

export const getResetPasswordByEmailErrorMessage = (
  error: ResetPasswordByEmailMutationError,
) => {
  return getApiErrorMessage(error, {
    400: 'Invalid email or password.',
    default: 'Unable to reset password. Please try again later.',
  })
}
