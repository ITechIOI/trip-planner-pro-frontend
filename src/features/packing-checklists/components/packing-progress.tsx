import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

type PackingProgressProps = {
  packed: number
  total: number
  percent?: number
  isLoading?: boolean
}

export const PackingProgress = ({
  packed,
  total,
  percent,
  isLoading = false,
}: PackingProgressProps) => {
  const rawProgress = percent ?? (total === 0 ? 0 : (packed / total) * 100)
  const progress = Math.min(
    Math.max(Number.isFinite(rawProgress) ? Math.round(rawProgress) : 0, 0),
    100,
  )

  return (
    <Paper variant="outlined" sx={{ display: 'inline-flex', p: 1.5 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            position: 'relative',
            width: 52,
            height: 52,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <CircularProgress
            variant="determinate"
            value={100}
            size={52}
            thickness={5}
            sx={{ color: 'action.hover', position: 'absolute' }}
          />
          <CircularProgress
            variant={isLoading ? 'indeterminate' : 'determinate'}
            value={progress}
            size={52}
            thickness={5}
            sx={{ color: 'primary.main', position: 'absolute' }}
          />
          {!isLoading ? (
            <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
              {progress}%
            </Typography>
          ) : null}
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 800 }}>
            {packed}/{total}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            Items packed
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}
