const ACCESS_TOKEN_STORAGE_KEY = "tripPlannerPro.accessToken";
const JWT_EXPIRY_CLAIM = "exp";

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

const getAccessTokenExpiry = (accessToken: string) => {
  const [, payload] = accessToken.split(".");

  if (!payload || typeof globalThis.atob !== "function") {
    return undefined;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "=",
    );
    const parsedPayload = JSON.parse(globalThis.atob(paddedPayload)) as Record<
      string,
      unknown
    >;
    const expiry = parsedPayload[JWT_EXPIRY_CLAIM];

    return typeof expiry === "number" && Number.isFinite(expiry)
      ? expiry
      : undefined;
  } catch {
    return undefined;
  }
};

export const isAccessTokenExpired = (accessToken?: string | null) => {
  const normalizedAccessToken = accessToken?.trim();

  if (!normalizedAccessToken) {
    return true;
  }

  const expiry = getAccessTokenExpiry(normalizedAccessToken);

  if (expiry === undefined) {
    return false;
  }

  return expiry * 1000 <= Date.now();
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

export const getValidAccessToken = () => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return undefined;
  }

  if (isAccessTokenExpired(accessToken)) {
    clearAccessToken();
    return undefined;
  }

  return accessToken;
};

export const hasValidAccessToken = () => Boolean(getValidAccessToken());
