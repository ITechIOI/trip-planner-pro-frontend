import { AlertTriangle, CheckCircle2, WalletCards } from 'lucide-react'
import type { TripDashboardResponse } from '@/shared'
import { ProgressBar } from '@/shared/components/ui'
import { getWarningTone } from '@/shared/lib/domain'
import { formatCurrency } from '@/shared/lib/display'

type DashboardSidePanelsProps = {
  dashboard: TripDashboardResponse
}

export const DashboardSidePanels = ({
  dashboard,
}: DashboardSidePanelsProps) => {
  const budgetTone = getWarningTone(dashboard.budgetUsage?.warningLevel)

  return (
    <div className="panel-stack">
      <article className="panel">
        <div className="panel__header">
          <div>
            <h2>Packing progress</h2>
            <p>Real-time packed vs unpacked state.</p>
          </div>
          <CheckCircle2 size={20} />
        </div>
        <ProgressBar value={dashboard.packingProgress?.percent} tone="success" />
        <p className="panel__metric">
          {dashboard.packingProgress?.packed ?? 0} packed from{' '}
          {dashboard.packingProgress?.total ?? 0} items
        </p>
      </article>

      <article className={`panel panel--${budgetTone}`}>
        <div className="panel__header">
          <div>
            <h2>Budget usage</h2>
            <p>{dashboard.budgetUsage?.warningLevel ?? 'SAFE'} budget status</p>
          </div>
          {budgetTone === 'critical' ? (
            <AlertTriangle size={20} />
          ) : (
            <WalletCards size={20} />
          )}
        </div>
        <ProgressBar value={dashboard.budgetUsage?.percent} tone={budgetTone} />
        <p className="panel__metric">
          {formatCurrency(dashboard.budgetUsage?.totalActualCost)} used from{' '}
          {formatCurrency(dashboard.budgetUsage?.initialBudget)}
        </p>
      </article>
    </div>
  )
}
