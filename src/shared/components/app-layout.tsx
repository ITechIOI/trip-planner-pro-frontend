import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { AppHeader } from '@/shared/components/app-header'
import { AppSidebar } from '@/shared/components/app-sidebar'

export type AppLayoutProps = {
  tripId: number
  children: ReactNode
}

export const AppLayout = ({ tripId, children }: AppLayoutProps) => (
  <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
    <AppSidebar tripId={tripId} />
    <Box
      sx={{
        pl: { xs: 9, md: '256px' },
        transition: 'padding-left 0.3s ease',
      }}
    >
      <AppHeader tripId={tripId} />
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  </Box>
)
