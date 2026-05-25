import { Box, Button, Typography } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

export type EmptyStateAction = {
  label: string
  onClick: () => void
}

export type EmptyStateProps = {
  icon: SvgIconComponent
  title: string
  description: string
  action?: EmptyStateAction
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: 3,
      py: 8,
      px: 3,
      textAlign: 'center',
    }}
  >
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        bgcolor: 'action.hover',
      }}
    >
      <Icon sx={{ fontSize: 28, color: 'text.secondary' }} />
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 420 }}>
      {description}
    </Typography>
    {action ? (
      <Button variant="contained" sx={{ mt: 3 }} onClick={action.onClick}>
        {action.label}
      </Button>
    ) : null}
  </Box>
)
