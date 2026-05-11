import { Box, Paper, Stack, Typography } from '@mui/material'
import {
  AlertTriangle,
  CircleDollarSign,
  PiggyBank,
  ReceiptText,
  TrendingUp,
  WalletCards,
} from 'lucide-react'
import { tripPlannerColors } from '@/app/theme'
import { BudgetCategoryDonut } from '@/features/budgets/components/budget-category-donut'
import type { BudgetSummaryResponse } from '@/shared'
import {
  Panel,
  ProgressBar,
  StatCard,
  StatusBadge,
} from '@/shared/components/ui'
import {
  getWarningTone,
} from '@/shared/lib/domain'
import { formatCurrency, formatPercent } from '@/shared/lib/display'

type BudgetSummaryProps = {
  summary?: BudgetSummaryResponse
}

type StatTone = 'neutral' | 'info' | 'success' | 'warning' | 'critical'

export const BudgetSummary = ({ summary }: BudgetSummaryProps) => {
  const warningTone = getWarningTone(summary?.warningLevel)

  return (
    <>
      <Box
        className="metrics-grid"
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
            xl: 'repeat(6, minmax(0, 1fr))',
          },
        }}
      >
        <StatCard
          label="Initial budget"
          value={formatCurrency(summary?.initialBudget)}
          detail="Trip budget"
          icon={<WalletCards size={19} />}
          tone="neutral"
        />
        <StatCard
          label="Actual spend"
          value={formatCurrency(summary?.totalActualCost)}
          detail="Paid or recorded actuals"
          icon={<ReceiptText size={19} />}
          tone={warningTone}
        />
        <StatCard
          label="Estimated total"
          value={formatCurrency(summary?.totalEstimatedCost)}
          detail="Planned costs"
          icon={<CircleDollarSign size={19} />}
          tone="info"
        />
        <StatCard
          label="Actual vs estimated"
          value={formatCurrency(summary?.actualMinusEstimatedCost)}
          detail="Positive means over estimate"
          icon={<TrendingUp size={19} />}
          tone={getActualMinusEstimatedTone(summary)}
        />
        <StatCard
          label="Remaining"
          value={formatCurrency(summary?.remainingBudget)}
          detail="Budget left"
          icon={<PiggyBank size={19} />}
          tone={getRemainingTone(summary)}
        />
        <StatCard
          label="Budget used"
          value={formatPercent(summary?.budgetUsagePercent)}
          detail={summary?.warningLevel ?? 'SAFE'}
          icon={<WalletCards size={19} />}
          tone={warningTone}
        />
      </Box>

      {summary?.warningLevel ? (
        <Paper
          className={`warning-banner warning-banner--${warningTone}`}
          component="article"
          variant="outlined"
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            p: 1.75,
            borderColor:
              warningTone === 'critical'
                ? '#FECACA'
                : warningTone === 'warning'
                  ? '#FDE68A'
                  : '#BBF7D0',
            bgcolor:
              warningTone === 'critical'
                ? '#FEE2E2'
                : warningTone === 'warning'
                  ? '#FEF3C7'
                  : '#DCFCE7',
          }}
        >
          <AlertTriangle size={18} />
          <Box>
            <Typography component="strong" sx={{ fontWeight: 900 }}>
              {summary.warningLevel}
            </Typography>
            <Typography sx={{ mt: 0.5 }}>
              Budget usage is {formatPercent(summary.budgetUsagePercent)} of the
              initial budget.
            </Typography>
          </Box>
        </Paper>
      ) : null}

      <Paper
        className="panel"
        component="article"
        variant="outlined"
        sx={{ display: 'grid', gap: 2, p: 2.25, borderColor: tripPlannerColors.border }}
      >
        <Box className="panel__header">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}
          >
            <Box>
              <Typography component="h2" variant="h2">
                Budget usage
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                80% shows WARNING and 100% shows CRITICAL.
              </Typography>
            </Box>
            <StatusBadge tone={warningTone}>
              {summary?.warningLevel ?? 'SAFE'}
            </StatusBadge>
          </Stack>
        </Box>
        <ProgressBar value={summary?.budgetUsagePercent} tone={warningTone} />
      </Paper>

      {summary?.categorySummaries?.length ? (
        <Panel
          description="Actual spend by budget category with estimated context."
          icon={<WalletCards size={18} />}
          title="Category totals"
        >
          <BudgetCategoryDonut categories={summary.categorySummaries} />
        </Panel>
      ) : null}
    </>
  )
}

const getActualMinusEstimatedTone = (
  summary?: BudgetSummaryResponse,
): StatTone => {
  if (
    summary?.actualMinusEstimatedCost != null &&
    summary.actualMinusEstimatedCost > 0
  ) {
    return 'warning'
  }

  return 'success'
}

const getRemainingTone = (summary?: BudgetSummaryResponse): StatTone => {
  if (summary?.remainingBudget != null && summary.remainingBudget < 0) {
    return 'critical'
  }

  return 'success'
}
