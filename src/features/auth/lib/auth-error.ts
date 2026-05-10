import type { LoginMutationError, RegisterMutationError } from "@/shared";
import { getApiErrorMessage } from "@/features/shared/lib";

export const getLoginErrorMessage = (error: LoginMutationError) => {
  return getApiErrorMessage(error, {
    400: "Invalid login information.",
    401: "Incorrect username or password.",
    default: "Unable to log in. Please try again later.",
  });
};

export const getRegisterErrorMessage = (error: RegisterMutationError) => {
  return getApiErrorMessage(error, {
    400: "Invalid registration information.",
    409: "Username is already in use.",
    default: "Unable to register. Please try again later.",
  });
};
