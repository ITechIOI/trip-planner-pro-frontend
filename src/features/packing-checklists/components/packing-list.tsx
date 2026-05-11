import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Check, Luggage, Pencil, Trash2 } from 'lucide-react'
import { tripPlannerColors } from '@/app/theme'
import { PackedStatus, RequiredStatus, type PackingChecklistResponse } from '@/shared'
import {
  ActionCluster,
  Button,
  CategoryIcon,
  StatusBadge,
} from '@/shared/components/ui'
import {
  getPackedStatusLabel,
  getPackingCategoryLabel,
  getRequiredStatusLabel,
} from '@/shared/lib/domain'

type PackingListProps = {
  canManage?: boolean
  items: PackingChecklistResponse[]
  onDelete: (item: PackingChecklistResponse) => void
  onEdit: (item: PackingChecklistResponse) => void
  onTogglePacked: (item: PackingChecklistResponse) => void
}

export const PackingList = ({
  canManage = true,
  items,
  onDelete,
  onEdit,
  onTogglePacked,
}: PackingListProps) => {
  const theme = useTheme()
  const isTableLayout = useMediaQuery(theme.breakpoints.up('md'))

  if (isTableLayout) {
    return (
      <TableContainer
        className="item-table"
        component={Paper}
        variant="outlined"
        sx={{ borderColor: tripPlannerColors.border }}
      >
        <Table aria-label="Packing items">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Requirement</TableCell>
              <TableCell>Packed</TableCell>
              {canManage ? <TableCell align="right">Actions</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow className="item-row" data-testid="item-row" key={item.id}>
                <TableCell>
                  <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                    <CategoryIcon
                      icon={<Luggage size={17} />}
                      label={getPackingCategoryLabel(item.category)}
                      tone={item.packedStatus === PackedStatus.PACKED ? 'success' : 'info'}
                    />
                    <Typography component="h2" variant="h3">
                      {item.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">{item.quantity ?? 0}</TableCell>
                <TableCell>
                  <StatusBadge tone="info">{getPackingCategoryLabel(item.category)}</StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    tone={
                      item.requiredStatus === RequiredStatus.REQUIRED
                        ? 'warning'
                        : 'neutral'
                    }
                  >
                    {getRequiredStatusLabel(item.requiredStatus)}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    tone={
                      item.packedStatus === PackedStatus.PACKED
                        ? 'success'
                        : 'neutral'
                    }
                  >
                    {getPackedStatusLabel(item.packedStatus)}
                  </StatusBadge>
                </TableCell>
                {canManage ? (
                  <TableCell align="right">
                    <ActionCluster>
                      <Button
                        type="button"
                        variant={
                          item.packedStatus === PackedStatus.PACKED
                            ? 'secondary'
                            : 'primary'
                        }
                        onClick={() => onTogglePacked(item)}
                      >
                        <Check size={15} />
                        {item.packedStatus === PackedStatus.PACKED
                          ? 'Mark unpacked'
                          : 'Mark packed'}
                      </Button>
                      <Button type="button" onClick={() => onEdit(item)}>
                        <Pencil size={15} />
                        Edit
                      </Button>
                      {item.id ? (
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => onDelete(item)}
                        >
                          <Trash2 size={15} />
                          Delete
                        </Button>
                      ) : null}
                    </ActionCluster>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <Stack className="item-list" spacing={1.5}>
      {items.map((item) => (
        <Paper
          className="item-row"
          component="article"
          data-testid="item-row"
          key={item.id}
          variant="outlined"
          sx={{
            display: 'grid',
            alignItems: 'center',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
            p: 2.25,
            borderColor: tripPlannerColors.border,
          }}
        >
          <Stack className="item-row__main" direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
            <CategoryIcon
              icon={<Luggage size={18} />}
              label={getPackingCategoryLabel(item.category)}
              tone={item.packedStatus === PackedStatus.PACKED ? 'success' : 'info'}
              size="lg"
            />
            <Box sx={{ display: 'grid', gap: 0.75, minWidth: 0 }}>
              <Typography component="h2" variant="h2">
                {item.name}
              </Typography>
              <Typography color="text.secondary">Quantity: {item.quantity ?? 0}</Typography>
              <Stack className="item-row__meta" direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <StatusBadge tone="info">{getPackingCategoryLabel(item.category)}</StatusBadge>
                <StatusBadge
                  tone={
                    item.requiredStatus === RequiredStatus.REQUIRED
                      ? 'warning'
                      : 'neutral'
                  }
                >
                  {getRequiredStatusLabel(item.requiredStatus)}
                </StatusBadge>
                <StatusBadge
                  tone={
                    item.packedStatus === PackedStatus.PACKED
                      ? 'success'
                      : 'neutral'
                  }
                >
                  {getPackedStatusLabel(item.packedStatus)}
                </StatusBadge>
              </Stack>
            </Box>
          </Stack>
          {canManage ? (
            <Stack
              className="item-row__actions"
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexWrap: 'wrap' }}
            >
              <Button
                type="button"
                variant={
                  item.packedStatus === PackedStatus.PACKED
                    ? 'secondary'
                    : 'primary'
                }
                onClick={() => onTogglePacked(item)}
              >
                <Check size={15} />
                {item.packedStatus === PackedStatus.PACKED
                  ? 'Mark unpacked'
                  : 'Mark packed'}
              </Button>
              <Button type="button" onClick={() => onEdit(item)}>
                <Pencil size={15} />
                Edit
              </Button>
              {item.id ? (
                <Button type="button" variant="danger" onClick={() => onDelete(item)}>
                  <Trash2 size={15} />
                  Delete
                </Button>
              ) : null}
            </Stack>
          ) : null}
        </Paper>
      ))}
    </Stack>
  )
}
