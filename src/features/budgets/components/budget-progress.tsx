import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { BudgetCategory } from '@/shared'
import {
  BUDGET_CATEGORIES,
  budgetCategoryColors,
  clampBudgetPercent,
  formatBudgetCurrency,
  formatBudgetPercent,
  getBudgetCategoryLabel,
  type BudgetCategoryTotals,
} from '../lib'

type BudgetProgressProps = {
  byCategory: Record<BudgetCategory, BudgetCategoryTotals>
  initialBudget?: number | null
  totalActualCost?: number | null
  usagePercent?: number | null
}

export const BudgetProgress = ({
  byCategory,
  initialBudget,
  totalActualCost,
  usagePercent,
}: BudgetProgressProps) => {
  const progressColor =
    (usagePercent ?? 0) >= 100
      ? 'error'
      : (usagePercent ?? 0) >= 80
        ? 'warning'
        : 'success'

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={1.75}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ justifyContent: 'space-between' }}
        >
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
            Budget usage - {formatBudgetPercent(usagePercent)} of{' '}
            {formatBudgetCurrency(initialBudget)}
          </Typography>
          <Typography color={`${progressColor}.main`} sx={{ fontWeight: 700 }}>
            {formatBudgetCurrency(totalActualCost)} used
          </Typography>
        </Stack>

        <LinearProgress
          aria-label="Budget usage"
          color={progressColor}
          value={clampBudgetPercent(usagePercent)}
          variant="determinate"
          sx={{ height: 8, borderRadius: 999 }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {BUDGET_CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={`${getBudgetCategoryLabel(category)}: ${formatBudgetCurrency(
                byCategory[category].totalActualCost,
              )}`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: `${budgetCategoryColors[category]}55`,
                color:
                  byCategory[category].totalActualCost > 0
                    ? budgetCategoryColors[category]
                    : 'text.secondary',
                fontWeight: 700,
              }}
            />
          ))}
        </Box>
      </Stack>
    </Paper>
  )
}
