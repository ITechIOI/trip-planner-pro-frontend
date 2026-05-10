import { setAccessToken, useLogin, useRegister } from '@/shared'

type UseLoginActionOptions = Parameters<typeof useLogin>[0]
type UseRegisterActionOptions = Parameters<typeof useRegister>[0]

export const useLoginAction = (options?: UseLoginActionOptions) => {
  return useLogin({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: async (data, variables, onMutateResult, context) => {
        setAccessToken(data.accessToken)
        await options?.mutation?.onSuccess?.(
          data,
          variables,
          onMutateResult,
          context,
        )
      },
    },
  })
}

export const useRegisterAction = (options?: UseRegisterActionOptions) => {
  return useRegister({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: async (data, variables, onMutateResult, context) => {
        setAccessToken(data.accessToken)
        await options?.mutation?.onSuccess?.(
          data,
          variables,
          onMutateResult,
          context,
        )
      },
    },
  })
}
