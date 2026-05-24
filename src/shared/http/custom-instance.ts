// src/shared/http/custom-instance.ts
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { getValidAccessToken } from "./auth-token";

declare const __API_BASE_URL__: string | undefined;

const API_BASE_URL =
  typeof __API_BASE_URL__ === "string" ? __API_BASE_URL__ : "";

export const AXIOS_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  withCredentials: false,
});

const PUBLIC_AUTH_PATHS = new Set([
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/password/reset",
]);

const createRequestId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `req-${Date.now()}-${Math.random().toString(36).slice(2)}`;

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const accessToken = getValidAccessToken();
const requestUrl = config.url ?? "";
  const isPublicAuthRequest = PUBLIC_AUTH_PATHS.has(requestUrl);

  config.headers["X-Request-Id"] = createRequestId();

  if (accessToken && !config.headers.Authorization && !isPublicAuthRequest) {
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
