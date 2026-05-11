type ApiErrorLike = {
  code?: string;
  message?: string;
  request?: unknown;
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
};

type ApiErrorMessages = Partial<Record<number, string>> & {
  default: string;
  network?: string;
  server?: string;
  timeout?: string;
};

const toApiErrorLike = (error: unknown): ApiErrorLike => {
  if (error && typeof error === "object") {
    return error as ApiErrorLike;
  }

  return {};
};

export const getApiErrorStatus = (error: unknown) => {
  return toApiErrorLike(error).response?.status;
};

const isTimeoutError = (error: ApiErrorLike) => {
  return error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
};

const isNetworkError = (error: ApiErrorLike) => {
  return !error.response && (Boolean(error.request) || error.message === "Network Error");
};

export const getApiErrorMessage = (
  error: unknown,
  messages: ApiErrorMessages,
) => {
  const apiError = toApiErrorLike(error);

  if (isTimeoutError(apiError)) {
    return messages.timeout ?? "The request took too long. Please try again.";
  }

  if (isNetworkError(apiError)) {
    return messages.network ?? "Connection lost. Check your internet and retry.";
  }

  const status = getApiErrorStatus(apiError);

  if (status !== undefined && messages[status]) {
    return messages[status];
  }

  if (status !== undefined && status >= 500 && messages.server) {
    return messages.server;
  }

  return messages.default;
};
