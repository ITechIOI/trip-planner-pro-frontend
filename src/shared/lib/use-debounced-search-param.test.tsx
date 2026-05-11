import { act, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSearchParams } from 'react-router-dom'
import { renderWithProviders } from '../../../tests/vitest/render'
import { useDebouncedSearchParam } from './use-debounced-search-param'

const SearchHarness = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = useDebouncedSearchParam({
    searchParams,
    setSearchParams,
    key: 'search',
    delayMs: 300,
  })

  return (
    <>
      <input
        aria-label="Search"
        onChange={(event) => search.onChange(event.target.value)}
        value={search.value}
      />
      <output aria-label="Query string">{searchParams.toString()}</output>
    </>
  )
}

describe('useDebouncedSearchParam', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('updates the search param after the debounce delay and clears pagination', () => {
    renderWithProviders(<SearchHarness />, {
      route: '/trips/1/budget?search=pass&offset=50',
    })

    fireEvent.change(screen.getByLabelText('Search'), {
      target: { value: 'passport' },
    })

    expect(screen.getByLabelText('Search')).toHaveValue('passport')
    expect(screen.getByLabelText('Query string')).toHaveTextContent(
      'search=pass&offset=50',
    )

    act(() => vi.advanceTimersByTime(300))

    expect(screen.getByLabelText('Query string')).toHaveTextContent(
      'search=passport',
    )
    expect(screen.getByLabelText('Query string')).not.toHaveTextContent(
      'offset=50',
    )
  })
})
