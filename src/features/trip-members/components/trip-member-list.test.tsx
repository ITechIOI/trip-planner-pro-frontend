import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TripMemberRole, type TripMemberResponse } from '@/shared'
import { renderWithProviders } from '../../../../tests/vitest/render'
import { TripMemberList } from './trip-member-list'

const members: TripMemberResponse[] = [
  {
    id: 401,
    userId: 501,
    tripId: 1,
    role: TripMemberRole.EDIT,
    user: {
      id: 501,
      fullName: 'Demo Traveler',
      email: 'demo@example.com',
      avatarUrl: null,
      phone: null,
      username: 'demo',
    },
  },
  {
    id: 402,
    userId: 999,
    tripId: 1,
    role: TripMemberRole.VIEW,
  },
]

describe('TripMemberList', () => {
  const renderDesktopTable = () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: query.includes('min-width'),
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    })

    return renderWithProviders(
      <TripMemberList
        canManageMembers
        members={members}
        onDelete={vi.fn()}
        onRoleChange={vi.fn()}
      />,
    )
  }

  it('renders embedded user identity and hides raw user ids', () => {
    const { container } = renderWithProviders(
      <TripMemberList
        canManageMembers
        members={members}
        onDelete={vi.fn()}
        onRoleChange={vi.fn()}
      />,
    )

    expect(screen.getByText('Demo Traveler')).toBeInTheDocument()
    expect(screen.getByText('demo@example.com')).toBeInTheDocument()
    expect(screen.getByText('Trip member')).toBeInTheDocument()
    expect(container).not.toHaveTextContent('User ID')
    expect(container).not.toHaveTextContent('ID:')
    expect(container).not.toHaveTextContent('U999')
  })

  it('uses fixed desktop table column widths for header and body alignment', () => {
    renderDesktopTable()

    const headers = screen.getAllByRole('columnheader')

    expect(headers.map((header) => header.textContent)).toEqual([
      'No.',
      'Member',
      'Role',
      'Actions',
    ])
    expect(headers[0]).toHaveStyle({ width: '72px' })
    expect(headers[2]).toHaveStyle({ width: '180px' })
    expect(headers[3]).toHaveStyle({ width: '220px' })
  })

  it('renders roles read-only when the user cannot manage members', () => {
    renderWithProviders(
      <TripMemberList
        canManageMembers={false}
        members={members}
        onDelete={vi.fn()}
        onRoleChange={vi.fn()}
      />,
    )

    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Role')).not.toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('View')).toBeInTheDocument()
  })
})
