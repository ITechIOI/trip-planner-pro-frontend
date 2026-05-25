import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import HotelIcon from '@mui/icons-material/Hotel'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { SvgIconComponent } from '@mui/icons-material'
import { BudgetCategory, PaymentStatus } from '@/shared'
import {
  budgetCategoryBackgroundColors,
  budgetCategoryColors,
  formatBudgetCurrency,
  getBudgetCategoryLabel,
  getPaymentStatusLabel,
  type BudgetItemView,
} from '../lib'

type BudgetItemCardProps = {
  canManageBudget: boolean
  item: BudgetItemView
  isActionPending?: boolean
  onDelete: (item: BudgetItemView) => void
  onEdit: (item: BudgetItemView) => void
}

const budgetCategoryIcons: Record<BudgetCategory, SvgIconComponent> = {
  [BudgetCategory.TRANSPORT]: DirectionsCarIcon,
  [BudgetCategory.ACCOMMODATION]: HotelIcon,
  [BudgetCategory.FOOD]: RestaurantIcon,
  [BudgetCategory.SHOPPING]: ShoppingBagOutlinedIcon,
  [BudgetCategory.ACTIVITY]: PhotoCameraOutlinedIcon,
  [BudgetCategory.OTHER]: MoreHorizIcon,
}

export const BudgetItemCard = ({
  canManageBudget,
  item,
  isActionPending = false,
  onDelete,
  onEdit,
}: BudgetItemCardProps) => {
  const actualCost = item.actualCost ?? 0
  const difference = actualCost - item.estimatedCost
  const isOverEstimate = difference > 0
  const isUnderEstimate = difference < 0
  const CategoryIcon = budgetCategoryIcons[item.category] ?? MoreHorizIcon

  return (
    <Paper variant="outlined" sx={{ p: 1.75, borderRadius: 2 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{
          alignItems: { md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: budgetCategoryBackgroundColors[item.category],
              color: budgetCategoryColors[item.category],
              alignItems: 'center',
              display: 'flex',
              flexShrink: 0,
              justifyContent: 'center',
            }}
          >
            <CategoryIcon fontSize="small" />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800 }} noWrap>
              {item.itemName}
            </Typography>
            <Stack
              direction="row"
              spacing={0.75}
              sx={{ flexWrap: 'wrap', mt: 0.75 }}
              useFlexGap
            >
              <Chip
                label={getBudgetCategoryLabel(item.category)}
                size="small"
                sx={{
                  bgcolor: budgetCategoryBackgroundColors[item.category],
                  color: budgetCategoryColors[item.category],
                  fontWeight: 800,
                }}
              />
              <Chip
                color={
                  item.paymentStatus === PaymentStatus.PAID
                    ? 'success'
                    : 'warning'
                }
                label={getPaymentStatusLabel(item.paymentStatus)}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: { xs: 'space-between', md: 'flex-end' },
          }}
        >
          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>
              Est: {formatBudgetCurrency(item.estimatedCost)}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>
              Actual:{' '}
              {item.actualCost == null
                ? 'Not set'
                : formatBudgetCurrency(item.actualCost)}
            </Typography>
            <Typography
              color={
                isOverEstimate
                  ? 'error.main'
                  : isUnderEstimate
                    ? 'success.main'
                    : 'text.secondary'
              }
              sx={{ fontSize: 12, fontWeight: 800 }}
            >
              {difference === 0 || item.actualCost == null
                ? '-'
                : `${isOverEstimate ? '+' : '-'} ${formatBudgetCurrency(
                    Math.abs(difference),
                  )}`}
            </Typography>
          </Box>

          {canManageBudget ? (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Edit expense">
                <span>
                  <IconButton
                    aria-label={`Edit ${item.itemName}`}
                    disabled={isActionPending}
                    size="small"
                    onClick={() => onEdit(item)}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Delete expense">
                <span>
                  <IconButton
                    aria-label={`Delete ${item.itemName}`}
                    color="error"
                    disabled={isActionPending}
                    size="small"
                    onClick={() => onDelete(item)}
                  >
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  )
}
