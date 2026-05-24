import { useState } from 'react'
import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { AppHeader } from '@/shared/components/app-header'
import {
  AppSidebar,
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from '@/shared/components/app-sidebar'

export type AppLayoutProps = {
  tripId: number
  children: ReactNode
}

export const AppLayout = ({ tripId, children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const sidebarWidth = sidebarCollapsed
    ? SIDEBAR_WIDTH_COLLAPSED
    : SIDEBAR_WIDTH_EXPANDED

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppSidebar
        tripId={tripId}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <Box
        sx={{
          pl: `${sidebarWidth}px`,
          transition: 'padding-left 0.3s ease',
          minHeight: '100vh',
        }}
      >
        <AppHeader tripId={tripId} />
        <Box component="main" sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
