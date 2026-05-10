import { describe, expect, it, vi } from 'vitest'
import type { QueryClient } from '@tanstack/react-query'
import { invalidateFeatureQueries, removeFeatureQueries } from './query-cache'

describe('feature query cache helpers', () => {
  it('invalidates each supplied feature query key', async () => {
    const invalidateQueries = vi.fn()
    const queryClient = { invalidateQueries } as unknown as QueryClient

    await invalidateFeatureQueries(queryClient, [['trips'], ['dashboard', 1]])

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['trips'] })
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['dashboard', 1],
    })
  })

  it('removes each supplied feature query key', () => {
    const removeQueries = vi.fn()
    const queryClient = { removeQueries } as unknown as QueryClient

    removeFeatureQueries(queryClient, [['trips'], ['dashboard', 1]])

    expect(removeQueries).toHaveBeenCalledWith({ queryKey: ['trips'] })
    expect(removeQueries).toHaveBeenCalledWith({ queryKey: ['dashboard', 1] })
  })
})
