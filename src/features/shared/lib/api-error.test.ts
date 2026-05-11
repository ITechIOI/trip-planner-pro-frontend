import { describe, expect, it } from 'vitest'
import { getApiErrorMessage } from './api-error'

type TestError = Parameters<typeof getApiErrorMessage>[0]

const asApiError = (error: unknown) => error as TestError

describe('getApiErrorMessage', () => {
  it('uses operation-specific status messages before backend messages', () => {
    const message = getApiErrorMessage(
      asApiError({
        response: {
          status: 403,
          data: { message: 'AccessDeniedException: internal policy name' },
        },
      }),
      {
        403: 'You do not have permission to update this item.',
        default: 'Item could not be updated.',
      },
    )

    expect(message).toBe('You do not have permission to update this item.')
  })

  it('returns a timeout-specific message when Axios reports a timeout', () => {
    const message = getApiErrorMessage(
      asApiError({ code: 'ECONNABORTED' }),
      {
        timeout: 'The request took too long. Please try again.',
        default: 'Item could not be saved.',
      },
    )

    expect(message).toBe('The request took too long. Please try again.')
  })

  it('returns a network-specific message when there is no response', () => {
    const message = getApiErrorMessage(
      asApiError({ request: {}, message: 'Network Error' }),
      {
        network: 'Connection lost. Check your internet and retry.',
        default: 'Item could not be saved.',
      },
    )

    expect(message).toBe('Connection lost. Check your internet and retry.')
  })
})
