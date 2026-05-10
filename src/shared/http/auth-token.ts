const ACCESS_TOKEN_STORAGE_KEY = "tripPlannerPro.accessToken";

const getLocalStorage = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

export const getAccessToken = () => {
  try {
    return getLocalStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};

export const setAccessToken = (accessToken?: string | null) => {
  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  const normalizedAccessToken = accessToken?.trim();

  if (!normalizedAccessToken) {
    try {
      storage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    } catch {
      // Ignore storage failures so auth mutations do not fail after success.
    }
    return;
  }

  try {
    storage.setItem(ACCESS_TOKEN_STORAGE_KEY, normalizedAccessToken);
  } catch {
    // Ignore storage failures so auth mutations do not fail after success.
  }
};

export const clearAccessToken = () => {
  setAccessToken();
};
