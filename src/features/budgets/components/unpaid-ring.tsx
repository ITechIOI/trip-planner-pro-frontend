import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

type UnpaidRingProps = {
  totalCount: number
  unpaidCount: number
}

export const UnpaidRing = ({ totalCount, unpaidCount }: UnpaidRingProps) => {
  const unpaidPercent =
    totalCount > 0 ? Math.round((unpaidCount / totalCount) * 100) : 0

  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={72}
          thickness={4.5}
          sx={{ color: 'action.hover' }}
        />
        <CircularProgress
          variant="determinate"
          value={unpaidPercent}
          size={72}
          thickness={4.5}
          sx={{
            color: unpaidPercent >= 50 ? 'error.main' : 'primary.main',
            left: 0,
            position: 'absolute',
          }}
        />
        <Box
          sx={{
            alignItems: 'center',
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 800 }}>
            {unpaidPercent}%
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 800 }}>
          {unpaidCount}/{totalCount}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 12 }}>
          Unpaid Budget Items
        </Typography>
      </Box>
    </Stack>
  )
}
