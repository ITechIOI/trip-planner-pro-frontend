// src/shared/http/custom-instance.ts
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { getAccessToken } from "./auth-token";

declare const __API_BASE_URL__: string | undefined;

const API_BASE_URL =
  typeof __API_BASE_URL__ === "string" ? __API_BASE_URL__ : "";
const PUBLIC_AUTH_PATHS = new Set([
  "/api/v1/auth/login",
  "/api/v1/auth/register",
]);

export const AXIOS_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  withCredentials: false,
});

const createRequestId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `req-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const getRequestPath = (url?: string) => {
  if (!url) {
    return "";
  }

  try {
    return new URL(url, API_BASE_URL || window.location.origin).pathname;
  } catch {
    return url.split("?")[0];
  }
};

const isPublicAuthRequest = (url?: string) =>
  PUBLIC_AUTH_PATHS.has(getRequestPath(url));

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  config.headers["X-Request-Id"] = createRequestId();

  if (
    accessToken &&
    !isPublicAuthRequest(config.url) &&
    !config.headers.Authorization
  ) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export const customInstance = async <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await AXIOS_INSTANCE.request<T>(config);
  return data;
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
