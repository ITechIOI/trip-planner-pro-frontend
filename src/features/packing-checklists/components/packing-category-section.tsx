import type { PackingItem } from '../types/packing-item'
import { PackingItemCard } from './packing-item-card'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { getPackingCategoryMeta } from '../lib/packing-category-meta'

type PackingCategorySectionProps = {
  category: PackingItem['category']
  items: PackingItem[]
  canManage: boolean
  isActionPending?: boolean
  onTogglePacked: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

export const PackingCategorySection = ({
  category,
  items,
  canManage,
  isActionPending = false,
  onTogglePacked,
  onDelete,
  onEdit,
}: PackingCategorySectionProps) => {
  const meta = getPackingCategoryMeta(category)
  const Icon = meta.Icon

  const packedCount = items.filter(
    (item) => item.packedStatus === 'PACKED',
  ).length

  const remaining = items.length - packedCount

  return (
    <Box component="section">
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              bgcolor: meta.bg,
              color: meta.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800 }}>{meta.label}</Typography>
            <Typography color="text.secondary" variant="body2">
              {packedCount} of {items.length} packed
            </Typography>
          </Box>
        </Stack>

        <Chip label={`${remaining} remaining`} size="small" variant="outlined" />
      </Stack>

      <Stack spacing={1.5}>
        {items.map((item) => (
          <PackingItemCard
            key={item.id}
            item={item}
            canManage={canManage}
            isActionPending={isActionPending}
            onTogglePacked={onTogglePacked}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </Stack>
    </Box>
  )
}
