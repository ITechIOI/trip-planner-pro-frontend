import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ItineraryForm } from './itinerary-form'

describe('ItineraryForm', () => {
  it('validates required activity title and chronological time range', async () => {
    const user = userEvent.setup()

    render(<ItineraryForm onClose={vi.fn()} onSubmit={vi.fn()} />)
    await user.type(screen.getByLabelText('Start time'), '2026-06-10T12:00')
    await user.type(screen.getByLabelText('End time'), '2026-06-10T10:00')
    await user.click(screen.getByRole('button', { name: 'Add activity' }))

    expect(await screen.findByText('Activity title is required')).toBeVisible()
    expect(screen.getByText('End time must be after start time')).toBeVisible()
  })
})
