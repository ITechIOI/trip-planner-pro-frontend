import type {
  LoginMutationError,
  RegisterMutationError,
  ResetPasswordByEmailMutationError,
} from "@/shared";
import { useQueryClient } from "@tanstack/react-query";
import { clearAuthenticatedQueryCache } from "@/shared/lib";
import { useAppUiStore } from "@/shared/stores";
import {
  setAccessToken,
  useLogin,
  useRegister,
  useResetPasswordByEmail,
} from "@/shared";

type UseLoginActionOptions<TContext = unknown> = Parameters<
  typeof useLogin<LoginMutationError, TContext>
>[0];
type UseRegisterActionOptions<TContext = unknown> = Parameters<
  typeof useRegister<RegisterMutationError, TContext>
>[0];
type UseResetPasswordByEmailActionOptions<TContext = unknown> = Parameters<
  typeof useResetPasswordByEmail<ResetPasswordByEmailMutationError, TContext>
>[0];

export const useLoginAction = <TContext = unknown>(
  options?: UseLoginActionOptions<TContext>,
) => {
  const queryClient = useQueryClient();

  return useLogin<LoginMutationError, TContext>({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: async (data, variables, onMutateResult, context) => {
        await clearAuthenticatedQueryCache(queryClient);
        useAppUiStore.getState().resetAppUiState();
        setAccessToken(data.accessToken);
        await options?.mutation?.onSuccess?.(
          data,
          variables,
          onMutateResult,
          context,
        );
      },
    },
  });
};

export const useRegisterAction = <TContext = unknown>(
  options?: UseRegisterActionOptions<TContext>,
) => {
  const queryClient = useQueryClient();

  return useRegister<RegisterMutationError, TContext>({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: async (data, variables, onMutateResult, context) => {
        await clearAuthenticatedQueryCache(queryClient);
        useAppUiStore.getState().resetAppUiState();
        setAccessToken(data.accessToken);
        await options?.mutation?.onSuccess?.(
          data,
          variables,
          onMutateResult,
          context,
        );
      },
    },
  });
};

export const useResetPasswordByEmailAction = <TContext = unknown>(
  options?: UseResetPasswordByEmailActionOptions<TContext>,
) => {
  return useResetPasswordByEmail<ResetPasswordByEmailMutationError, TContext>(
    options,
  );
};
