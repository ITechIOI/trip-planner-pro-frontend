import { describe, expect, it } from 'vitest'
import { DEFAULT_PAGE_LIMIT, getPageOffset } from './pagination'

describe('pagination contract', () => {
  it('uses the backend maximum list page size', () => {
    expect(DEFAULT_PAGE_LIMIT).toBe(50)
  })

  it('normalizes URL offsets for paginated list APIs', () => {
    expect(getPageOffset('50')).toBe(50)
    expect(getPageOffset('-10')).toBe(0)
    expect(getPageOffset('abc')).toBe(0)
  })
})
