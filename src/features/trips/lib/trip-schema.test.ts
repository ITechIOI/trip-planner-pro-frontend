import { describe, expect, it } from 'vitest'
import { normalizeTripDate, tripSchema } from './trip-schema'

describe('trip schema', () => {
  it('rejects an empty trip name and negative budget', () => {
    const result = tripSchema.safeParse({
      name: ' ',
      estimatedBudget: -1,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      'Trip name is required',
      'Budget cannot be negative',
    ])
  })

  it('normalizes blank date inputs to null for API requests', () => {
    expect(normalizeTripDate('')).toBeNull()
    expect(normalizeTripDate('2026-06-10')).toBe('2026-06-10')
  })
})
