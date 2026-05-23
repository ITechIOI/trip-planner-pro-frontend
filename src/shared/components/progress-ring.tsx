import { Box, CircularProgress, Typography } from '@mui/material'

export type ProgressRingVariant = 'default' | 'danger'

export type ProgressRingProps = {
  progress: number
  size?: number
  strokeWidth?: number
  variant?: ProgressRingVariant
}

export const ProgressRing = ({
  progress,
  size = 48,
  strokeWidth = 4,
  variant = 'default',
}: ProgressRingProps) => {
  const clampedProgress = Math.min(100, Math.max(0, progress))
  const color = variant === 'danger' ? 'error' : 'primary'

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        width: size,
        height: size,
      }}
    >
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={strokeWidth}
        sx={{ color: 'action.hover', position: 'absolute' }}
      />
      <CircularProgress
        variant="determinate"
        value={clampedProgress}
        size={size}
        thickness={strokeWidth}
        color={color}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="span" sx={{ fontWeight: 600 }}>
          {Math.round(clampedProgress)}%
        </Typography>
      </Box>
    </Box>
  )
}
