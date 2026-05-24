type ApiErrorLike = {
  response?: {
    status?: number;
  };
};

type ApiErrorMessages = Partial<Record<number, string>> & {
  default: string;
};

export const getApiErrorStatus = (error: ApiErrorLike) => {
  return error.response?.status;
};

export const getApiErrorMessage = (
  error: ApiErrorLike,
  messages: ApiErrorMessages,
) => {
  const status = getApiErrorStatus(error);

  if (status !== undefined && messages[status]) {
    return messages[status];
  }

  return messages.default;
};
