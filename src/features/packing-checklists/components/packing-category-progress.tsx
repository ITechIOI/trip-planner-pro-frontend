import type { PackingItem } from '../types/packing-item'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {
  PACKING_CATEGORIES,
  getPackingCategoryMeta,
} from '../lib/packing-category-meta'

type PackingCategoryProgressProps = {
  items: PackingItem[]
}

export const PackingCategoryProgress = ({
  items,
}: PackingCategoryProgressProps) => {
  const categoryProgress = PACKING_CATEGORIES.map((category) => {
    const categoryItems = items.filter((item) => item.category === category)

    return {
      category,
      total: categoryItems.length,
      packed: categoryItems.filter((item) => item.packedStatus === 'PACKED')
        .length,
    }
  })

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 1.5,
      }}
    >
      {categoryProgress.map((item) => {
        const percentage =
          item.total === 0 ? 0 : (item.packed / item.total) * 100
        const meta = getPackingCategoryMeta(item.category)
        const Icon = meta.Icon

        return (
          <Paper
            key={item.category}
            variant="outlined"
            sx={{ p: 1.75, borderRadius: 2 }}
          >
            <Stack spacing={1}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  display: 'grid',
                  placeItems: 'center',
                  mx: 'auto',
                  bgcolor: meta.bg,
                  color: meta.color,
                }}
              >
                <Icon sx={{ fontSize: 20 }} />
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography color="text.secondary" variant="caption">
                  {meta.label}
                </Typography>
                <Typography sx={{ fontWeight: 800 }}>
                  {item.packed}/{item.total}
                </Typography>
              </Box>

              <LinearProgress
                aria-label={`${meta.label} packing progress`}
                variant="determinate"
                value={percentage}
                sx={{ height: 4, borderRadius: 999 }}
              />
            </Stack>
          </Paper>
        )
      })}
    </Box>
  )
}
