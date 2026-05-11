import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  ErrorState,
  FieldError,
  FilterToolbar,
  PaginationControls,
  ProgressBar,
  StatCard,
} from './ui'

describe('shared UI components', () => {
  it('clamps progressbar values to the accessible 0-100 range', () => {
    const { rerender } = render(<ProgressBar value={120} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')

    rerender(<ProgressBar value={-10} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('renders field errors as alerts only when a message exists', () => {
    const { rerender } = render(<FieldError />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    rerender(<FieldError message="Name is required" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Name is required')
  })

  it('emits next and previous pagination offsets from visible controls', async () => {
    const onOffsetChange = vi.fn()
    const user = userEvent.setup()

    render(
      <PaginationControls
        offset={50}
        limit={50}
        total={125}
        onOffsetChange={onOffsetChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Previous' }))
    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(onOffsetChange).toHaveBeenNthCalledWith(1, 0)
    expect(onOffsetChange).toHaveBeenNthCalledWith(2, 100)
  })

  it('uses an alert role for retryable errors', () => {
    render(<ErrorState description="Budget data could not be loaded." />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Budget data could not be loaded.',
    )
  })

  it('renders stat card progress with accessible labelling', () => {
    render(
      <StatCard
        label="Packing complete"
        value="72%"
        detail="43 of 60 packed"
        progress={72}
        progressLabel="Packing progress"
      />,
    )

    expect(screen.getByText('Packing complete')).toBeVisible()
    expect(screen.getByRole('progressbar', { name: 'Packing progress' }))
      .toHaveAttribute('aria-valuenow', '72')
  })

  it('groups filters in a labelled toolbar', () => {
    render(
      <FilterToolbar label="Budget filters">
        <button type="button">Reset</button>
      </FilterToolbar>,
    )

    expect(screen.getByLabelText('Budget filters')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeVisible()
  })
})
