import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { AppSidebar } from '@/shared/components/app-sidebar'

export type AppLayoutProps = {
  tripId: number
  children: ReactNode
}

export const AppLayout = ({ tripId, children }: AppLayoutProps) => (
  <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
    <AppSidebar tripId={tripId} />
    <Box
      sx={{
        pl: { xs: '72px', md: '256px' },
      }}
    >
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  </Box>
)
