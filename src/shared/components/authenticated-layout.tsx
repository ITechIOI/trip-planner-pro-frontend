import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { AppHeader } from './app-header'

export const AuthenticatedLayout = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
    <AppHeader />
    <Outlet />
  </Box>
)
