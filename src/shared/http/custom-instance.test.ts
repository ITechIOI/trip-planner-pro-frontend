import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it } from 'vitest'
import { AXIOS_INSTANCE } from './custom-instance'

const getHeader = (
  headers: AxiosRequestConfig['headers'],
  name: string,
): unknown => {
  if (
    headers &&
    typeof headers === 'object' &&
    'get' in headers &&
    typeof headers.get === 'function'
  ) {
    return headers.get(name)
  }

  return (headers as Record<string, unknown> | undefined)?.[name]
}

const captureRequestConfig = async (url: string) => {
  let capturedConfig: AxiosRequestConfig | undefined

  await AXIOS_INSTANCE.request({
    data: {},
    method: 'POST',
    url,
    adapter: async (config): Promise<AxiosResponse> => {
      capturedConfig = config

      return {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }
    },
  })

  return capturedConfig
}

describe('custom axios instance', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('does not attach stale bearer tokens to auth endpoints', async () => {
    window.localStorage.setItem('tripPlannerPro.accessToken', 'stale-token')

    const loginConfig = await captureRequestConfig('/api/v1/auth/login')
    const registerConfig = await captureRequestConfig('/api/v1/auth/register')

    expect(getHeader(loginConfig?.headers, 'Authorization')).toBeUndefined()
    expect(getHeader(registerConfig?.headers, 'Authorization')).toBeUndefined()
  })

  it('attaches bearer tokens to protected API endpoints', async () => {
    window.localStorage.setItem('tripPlannerPro.accessToken', 'valid-token')

    const config = await captureRequestConfig('/api/v1/trips')

    expect(getHeader(config?.headers, 'Authorization')).toBe(
      'Bearer valid-token',
    )
  })
})
