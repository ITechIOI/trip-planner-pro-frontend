import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AXIOS_INSTANCE, customInstance } from './custom-instance'

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

  afterEach(() => {
    vi.restoreAllMocks()
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

  it('lets Axios set multipart boundaries for FormData requests', async () => {
    const formData = new FormData()
    formData.append('file', new File(['avatar'], 'avatar.png', { type: 'image/png' }))
    const requestSpy = vi.spyOn(AXIOS_INSTANCE, 'request').mockResolvedValue({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    })

    await customInstance({
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      method: 'PATCH',
      url: '/api/v1/users/me/avatar',
    })

    expect(
      getHeader(requestSpy.mock.calls[0]?.[0].headers, 'Content-Type'),
    ).toBeUndefined()
  })
})
