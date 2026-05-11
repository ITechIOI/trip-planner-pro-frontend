import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ItineraryCategory, ItineraryPriority, ItineraryStatus } from '@/shared'
import { renderWithProviders } from '../../../../tests/vitest/render'
import { ItineraryForm } from './itinerary-form'

describe('ItineraryForm', () => {
  it('validates required activity title and chronological time range', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <ItineraryForm
        itinerary={{
          activityTitle: '',
          category: ItineraryCategory.OTHER,
          priority: ItineraryPriority.MEDIUM,
          status: ItineraryStatus.PLANNED,
          startTime: '2026-06-10T12:00:00',
          endTime: '2026-06-10T10:00:00',
        }}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Save activity' }))

    expect(await screen.findByText('Activity title is required')).toBeVisible()
    expect(screen.getByText('End time must be after start time')).toBeVisible()
  })
})
