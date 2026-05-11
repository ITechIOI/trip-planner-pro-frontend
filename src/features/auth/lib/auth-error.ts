import { getApiErrorMessage } from "@/features/shared/lib";

export const getLoginErrorMessage = (error: unknown) => {
  return getApiErrorMessage(error, {
    400: "Check your username and password, then try again.",
    401: "Username or password is incorrect.",
    default: "Could not sign in. Please try again.",
    network: "Connection lost. Check your internet and sign in again.",
    timeout: "Sign in took too long. Please try again.",
  });
};

export const getRegisterErrorMessage = (error: unknown) => {
  return getApiErrorMessage(error, {
    400: "Check the registration details and try again.",
    409: "That username is already in use.",
    default: "Could not create your account. Please try again.",
    network: "Connection lost. Check your internet and try again.",
    timeout: "Account creation took too long. Please try again.",
  });
};
