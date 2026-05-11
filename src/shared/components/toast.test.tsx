import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { ToastProvider } from './toast'
import {
  resetToastStore,
  showErrorToast,
  showSuccessToast,
} from './toast-store'

describe('ToastProvider', () => {
  afterEach(() => {
    resetToastStore()
  })

  it('renders success notifications with status semantics', () => {
    render(<ToastProvider />)

    act(() => showSuccessToast('Trip saved.'))

    expect(screen.getByRole('status')).toHaveTextContent('Trip saved.')
  })

  it('renders error notifications with alert semantics and allows dismissal', async () => {
    const user = userEvent.setup()
    render(<ToastProvider />)

    act(() => showErrorToast('Budget item could not be deleted.'))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Budget item could not be deleted.',
    )

    await user.click(screen.getByRole('button', { name: 'Close notification' }))

    await waitFor(() =>
      expect(
        screen.queryByText('Budget item could not be deleted.'),
      ).not.toBeInTheDocument(),
    )
  })
})
