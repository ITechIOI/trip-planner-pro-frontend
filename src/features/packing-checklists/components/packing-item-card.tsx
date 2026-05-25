import type { PackingItem } from '../types/packing-item'
import CheckIcon from '@mui/icons-material/Check'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { getPackingCategoryMeta } from '../lib/packing-category-meta'

type PackingItemCardProps = {
  item: PackingItem
  canManage: boolean
  isActionPending?: boolean
  onTogglePacked: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

export const PackingItemCard = ({
  item,
  canManage,
  isActionPending = false,
  onTogglePacked,
  onDelete,
  onEdit,
}: PackingItemCardProps) => {
  const isPacked = item.packedStatus === 'PACKED'
  const meta = getPackingCategoryMeta(item.category)
  const CategoryIcon = meta.Icon

  return (
    <Paper
      variant="outlined"
      sx={{
        bgcolor: isPacked ? '#ECFDF5' : 'background.paper',
        borderColor: isPacked ? '#A7F3D0' : 'divider',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', minWidth: 0 }}
        >
          {canManage ? (
            <Tooltip title={isPacked ? 'Mark as unpacked' : 'Mark as packed'}>
              <span>
                <IconButton
                  aria-label={isPacked ? 'Mark as unpacked' : 'Mark as packed'}
                  disabled={isActionPending}
                  onClick={() => onTogglePacked(item.id)}
                  size="small"
                  sx={{
                    bgcolor: isPacked ? 'success.main' : 'background.paper',
                    border: 1,
                    borderColor: isPacked ? 'success.main' : 'divider',
                    color: isPacked ? 'success.contrastText' : 'text.secondary',
                    '&:hover': {
                      bgcolor: isPacked ? 'success.dark' : 'action.hover',
                    },
                  }}
                >
                  {isPacked ? <CheckIcon fontSize="small" /> : null}
                </IconButton>
              </span>
            </Tooltip>
          ) : null}

          <Box
            sx={{
              width: 40,
              height: 40,
              flex: '0 0 40px',
              borderRadius: 1.5,
              bgcolor: meta.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: meta.color,
            }}
          >
            <CategoryIcon sx={{ fontSize: 22 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexWrap: 'wrap' }}
              useFlexGap
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  textDecoration: isPacked ? 'line-through' : 'none',
                }}
              >
                {item.name}
              </Typography>
              {item.requiredStatus === 'REQUIRED' ? (
                <Chip
                  color="error"
                  label="Required"
                  size="small"
                  variant="outlined"
                />
              ) : null}
              <Chip
                color={isPacked ? 'success' : 'default'}
                label={isPacked ? 'Packed' : 'Not packed'}
                size="small"
              />
            </Stack>

            <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
              Qty: {item.quantity} / {meta.label}
            </Typography>
          </Box>
        </Stack>

        {canManage ? (
          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
            <Tooltip title="Edit item">
              <span>
                <IconButton
                  aria-label="Edit item"
                  color="primary"
                  disabled={isActionPending}
                  onClick={() => onEdit(item.id)}
                  size="small"
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete item">
              <span>
                <IconButton
                  aria-label="Delete item"
                  color="error"
                  disabled={isActionPending}
                  onClick={() => onDelete(item.id)}
                  size="small"
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  )
}
