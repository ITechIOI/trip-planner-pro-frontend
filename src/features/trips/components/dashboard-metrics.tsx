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
    <div className="metrics-grid">
      <StatCard
        label="Itinerary complete"
        value={formatPercent(dashboard.itineraryProgress?.percent)}
        detail={`${dashboard.itineraryProgress?.done ?? 0} of ${
          dashboard.itineraryProgress?.total ?? 0
        } done`}
        tone="info"
      />
      <StatCard
        label="Packing complete"
        value={formatPercent(dashboard.packingProgress?.percent)}
        detail={`${dashboard.packingProgress?.packed ?? 0} of ${
          dashboard.packingProgress?.total ?? 0
        } packed`}
        tone="success"
      />
      <StatCard
        label="Budget used"
        value={formatPercent(dashboard.budgetUsage?.percent)}
        detail={formatCurrency(dashboard.budgetUsage?.totalActualCost)}
        tone={budgetTone}
      />
      <StatCard
        label="Unpaid items"
        value={String(dashboard.unpaidBudgetItemCount ?? 0)}
        detail="Budget items still unpaid"
        tone="warning"
      />
      <StatCard
        label="Overdue activities"
        value={String(dashboard.overdueActivityCount ?? 0)}
        detail="Not done past time"
        tone={
          dashboard.overdueActivityCount && dashboard.overdueActivityCount > 0
            ? 'critical'
            : 'success'
        }
      />
    </div>
  )
}
