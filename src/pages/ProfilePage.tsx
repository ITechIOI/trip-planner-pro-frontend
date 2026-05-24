import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export const ProfilePage = () => (
  <Box component="main" sx={{ minHeight: 'calc(100vh - 64px)', p: 3 }}>
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        p: { xs: 3, sm: 5 },
      }}
    >
      <Stack spacing={1}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
          Profile
        </Typography>
        <Typography color="text.secondary">
          Profile settings will be available here.
        </Typography>
      </Stack>
    </Paper>
  </Box>
)

export default ProfilePage
