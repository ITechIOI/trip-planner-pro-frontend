import { Box } from '@mui/material'
import {
  AlertTriangle,
  CalendarCheck,
  Luggage,
  ReceiptText,
  WalletCards,
} from 'lucide-react'
import type { TripDashboardResponse } from '@/shared'
import { StatCard } from '@/shared/components/ui'
import { getWarningTone } from '@/shared/lib/domain'
import { formatCurrency, formatPercent } from '@/shared/lib/display'

type DashboardMetricsProps = {
  dashboard: TripDashboardResponse
}

export const DashboardMetrics = ({ dashboard }: DashboardMetricsProps) => {
  const budgetTone = getWarningTone(dashboard.budgetUsage?.warningLevel)

  return (
    <Box
      className="metrics-grid"
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(5, minmax(0, 1fr))',
        },
      }}
    >
      <StatCard
        label="Itinerary complete"
        value={formatPercent(dashboard.itineraryProgress?.percent)}
        detail={`${dashboard.itineraryProgress?.done ?? 0} of ${
          dashboard.itineraryProgress?.total ?? 0
        } done`}
        icon={<CalendarCheck size={19} />}
        progress={dashboard.itineraryProgress?.percent}
        progressLabel="Itinerary progress"
        tone="info"
      />
      <StatCard
        label="Packing complete"
        value={formatPercent(dashboard.packingProgress?.percent)}
        detail={`${dashboard.packingProgress?.packed ?? 0} of ${
          dashboard.packingProgress?.total ?? 0
        } packed`}
        icon={<Luggage size={19} />}
        progress={dashboard.packingProgress?.percent}
        progressLabel="Packing progress"
        tone="success"
      />
      <StatCard
        label="Budget used"
        value={formatPercent(dashboard.budgetUsage?.percent)}
        detail={formatCurrency(dashboard.budgetUsage?.totalActualCost)}
        icon={<WalletCards size={19} />}
        progress={dashboard.budgetUsage?.percent}
        progressLabel="Budget usage progress"
        tone={budgetTone}
      />
      <StatCard
        label="Unpaid items"
        value={String(dashboard.unpaidBudgetItemCount ?? 0)}
        detail="Budget items still unpaid"
        icon={<ReceiptText size={19} />}
        tone="warning"
      />
      <StatCard
        label="Overdue activities"
        value={String(dashboard.overdueActivityCount ?? 0)}
        detail="Not done past time"
        icon={<AlertTriangle size={19} />}
        tone={
          dashboard.overdueActivityCount && dashboard.overdueActivityCount > 0
            ? 'critical'
            : 'success'
        }
      />
    </Box>
  )
}
