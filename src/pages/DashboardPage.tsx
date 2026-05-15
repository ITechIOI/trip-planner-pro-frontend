import { Box, Paper, Typography } from '@mui/material'

export const DashboardPage = () => {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: '#f8fafc',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 'min(100%, 560px)',
          border: '1px solid #e2e8f0',
          borderRadius: 3,
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          You are signed in to Trip Planner Pro.
        </Typography>
      </Paper>
    </Box>
  )
}
