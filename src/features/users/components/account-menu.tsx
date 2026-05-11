import { useQueryClient } from '@tanstack/react-query'
import {
  Avatar,
  Box,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import { LogOut, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tripPlannerColors } from '@/app/theme'
import { useCurrentUser } from '@/features/users/api'
import { clearAccessToken, type UserResponse } from '@/shared'
import { IconButton } from '@/shared/components/ui'

const getInitials = (name?: string, username?: string) => {
  const source = name?.trim() || username?.trim() || 'User'
  const initials = source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return initials || 'U'
}

export const AccountMenu = () => {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const currentUserQuery = useCurrentUser()
  const currentUser = currentUserQuery.data as UserResponse | undefined
  const isOpen = Boolean(anchorElement)

  const closeMenu = () => setAnchorElement(null)

  const openProfile = () => {
    closeMenu()
    navigate('/profile')
  }

  const signOut = () => {
    closeMenu()
    clearAccessToken()
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <IconButton
        aria-controls={isOpen ? 'account-menu' : undefined}
        aria-expanded={isOpen ? 'true' : undefined}
        aria-haspopup="menu"
        aria-label="Open account menu"
        onClick={(event) => setAnchorElement(event.currentTarget)}
        type="button"
        sx={{
          p: 0.25,
          width: 44,
          height: 44,
        }}
      >
        <Avatar
          alt={currentUser?.fullName || currentUser?.username || 'User'}
          src={currentUser?.avatarUrl ?? undefined}
          sx={{
            width: 34,
            height: 34,
            bgcolor: tripPlannerColors.primaryStrong,
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {getInitials(currentUser?.fullName, currentUser?.username)}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorElement}
        id="account-menu"
        onClose={closeMenu}
        open={isOpen}
        slotProps={{
          paper: {
            sx: {
              minWidth: 240,
              mt: 1,
              border: `1px solid ${tripPlannerColors.border}`,
              boxShadow: '0 18px 45px rgba(15, 23, 42, 0.12)',
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 700 }}>
            {currentUser?.fullName || 'Account'}
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
            {currentUserQuery.isLoading
              ? 'Loading profile...'
              : currentUser?.username
                ? `@${currentUser.username}`
                : 'Profile settings'}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={openProfile}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <UserRound size={17} />
            <Box component="span">Profile</Box>
          </Stack>
        </MenuItem>
        <MenuItem onClick={signOut}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <LogOut size={17} />
            <Box component="span">Sign out</Box>
          </Stack>
        </MenuItem>
      </Menu>
    </>
  )
}
