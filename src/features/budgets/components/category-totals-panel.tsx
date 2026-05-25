import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PieChartOutlinedIcon from '@mui/icons-material/PieChartOutlined'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import type { BudgetCategory } from '@/shared'
import {
  BUDGET_CATEGORIES,
  budgetCategoryColors,
  formatBudgetCurrency,
  formatBudgetNumber,
  getBudgetCategoryLabel,
  type BudgetCategoryTotals,
} from '../lib'

type CategoryTotalsPanelProps = {
  byCategory: Record<BudgetCategory, BudgetCategoryTotals>
}

type DonutSlice = {
  category: BudgetCategory
  color: string
  offset: number
  segmentLength: number
}

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export const CategoryTotalsPanel = ({
  byCategory,
}: CategoryTotalsPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const activeCategories = BUDGET_CATEGORIES.map((category) => ({
    ...byCategory[category],
    category,
  })).filter(
    (category) =>
      category.totalActualCost > 0 || category.totalEstimatedCost > 0,
  )

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Stack
        component="button"
        direction="row"
        onClick={() => setIsOpen((value) => !value)}
        sx={{
          alignItems: 'center',
          bgcolor: 'transparent',
          border: 0,
          cursor: 'pointer',
          justifyContent: 'space-between',
          p: 2,
          textAlign: 'left',
          width: '100%',
          '&:hover': { bgcolor: 'action.hover' },
        }}
        type="button"
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: 'rgba(18, 132, 248, 0.1)',
              color: 'primary.main',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <PieChartOutlinedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800 }}>Category totals</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Actual spend by budget category with estimated context.
            </Typography>
          </Box>
        </Stack>
        <Box
          aria-hidden="true"
          sx={{
            alignItems: 'center',
            borderRadius: '50%',
            display: 'flex',
            height: 32,
            justifyContent: 'center',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 160ms ease',
            width: 32,
          }}
        >
          <ExpandMoreIcon />
        </Box>
      </Stack>

      <Collapse in={isOpen}>
        <Box sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
          {activeCategories.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ py: 4, textAlign: 'center' }}
            >
              No expense data yet. Add expenses to see category totals.
            </Typography>
          ) : (
            <CategoryDonutChart items={activeCategories} />
          )}
        </Box>
      </Collapse>
    </Paper>
  )
}

const CategoryDonutChart = ({
  items,
}: {
  items: BudgetCategoryTotals[]
}) => {
  const slices = useMemo(() => buildSlices(items), [items])
  const totalActual = items.reduce(
    (sum, item) => sum + item.totalActualCost,
    0,
  )

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', md: '180px minmax(0, 1fr)' },
        alignItems: 'center',
      }}
    >
      <Box
        aria-label="Category spending donut chart"
        component="svg"
        role="img"
        viewBox="0 0 180 180"
        sx={{ width: 180, height: 180, mx: { xs: 'auto', md: 0 } }}
      >
        <circle
          cx="90"
          cy="90"
          fill="none"
          r={RADIUS}
          stroke="rgba(0, 0, 0, 0.07)"
          strokeWidth="22"
        />
        {slices.map((slice) => (
          <circle
            key={slice.category}
            cx="90"
            cy="90"
            fill="none"
            r={RADIUS}
            stroke={slice.color}
            strokeDasharray={`${slice.segmentLength} ${
              CIRCUMFERENCE - slice.segmentLength
            }`}
            strokeDashoffset={-slice.offset}
            strokeLinecap="butt"
            strokeWidth="22"
            transform="rotate(-90 90 90)"
          />
        ))}
        <circle cx="90" cy="90" fill="white" r="38" />
        <text
          dominantBaseline="middle"
          fill="#6b7280"
          fontSize="11"
          fontWeight="700"
          textAnchor="middle"
          x="90"
          y="82"
        >
          Total
        </text>
        <text
          dominantBaseline="middle"
          fill="#111827"
          fontSize="14"
          fontWeight="900"
          textAnchor="middle"
          x="90"
          y="99"
        >
          {formatBudgetNumber(totalActual)}
        </text>
      </Box>

      <Stack spacing={1.25}>
        {items.map((item) => (
          <Stack
            key={item.category}
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: 'center',
              borderBottom: 1,
              borderColor: 'divider',
              justifyContent: 'space-between',
              pb: 1,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: budgetCategoryColors[item.category],
                }}
              />
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  {getBudgetCategoryLabel(item.category)}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                  {item.itemCount} items -{' '}
                  {formatBudgetCurrency(item.totalEstimatedCost)} estimated
                </Typography>
              </Box>
            </Stack>
            <Typography sx={{ fontWeight: 800 }}>
              {formatBudgetCurrency(item.totalActualCost)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

const buildSlices = (items: BudgetCategoryTotals[]): DonutSlice[] => {
  const total = items.reduce((sum, item) => sum + item.totalActualCost, 0)

  if (total <= 0) {
    return []
  }

  let offset = 0

  return items
    .filter((item) => item.totalActualCost > 0)
    .map((item) => {
      const segmentLength = (item.totalActualCost / total) * CIRCUMFERENCE
      const slice = {
        category: item.category,
        color: budgetCategoryColors[item.category],
        offset,
        segmentLength,
      }

      offset += segmentLength

      return slice
    })
}
