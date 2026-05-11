import { Stack, Typography } from '@mui/material'
import { AlertTriangle, CheckCircle2, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { TripDashboardResponse } from '@/shared'
import { Button, Panel, ProgressBar, StatusBadge } from '@/shared/components/ui'
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
    <Stack className="panel-stack" spacing={2}>
      <Panel
        action={
          <Button component={Link} to="../packing" type="button" variant="ghost">
            Open checklist
          </Button>
        }
        icon={<CheckCircle2 size={18} />}
        title="Packing progress"
        description="Real-time packed vs unpacked state."
      >
        <Stack spacing={1.5}>
          <ProgressBar value={dashboard.packingProgress?.percent} tone="success" />
          <Typography className="panel__metric" sx={{ fontWeight: 700 }}>
            {dashboard.packingProgress?.packed ?? 0} packed from{' '}
            {dashboard.packingProgress?.total ?? 0} items
          </Typography>
        </Stack>
      </Panel>

      <Panel
        action={
          <Button component={Link} to="../budget" type="button" variant="ghost">
            View budget
          </Button>
        }
        className={`panel--${budgetTone}`}
        icon={
          budgetTone === 'critical' ? (
            <AlertTriangle size={18} />
          ) : (
            <WalletCards size={18} />
          )
        }
        title="Budget usage"
        description={`${dashboard.budgetUsage?.warningLevel ?? 'SAFE'} budget status`}
        sx={{
          borderColor:
            budgetTone === 'critical'
              ? '#FECACA'
              : budgetTone === 'warning'
                ? '#FDE68A'
                : undefined,
        }}
      >
        <Stack spacing={1.5}>
          <StatusBadge tone={budgetTone}>
            {dashboard.budgetUsage?.warningLevel ?? 'SAFE'}
          </StatusBadge>
          <ProgressBar value={dashboard.budgetUsage?.percent} tone={budgetTone} />
          <Typography className="panel__metric" sx={{ fontWeight: 700 }}>
            {formatCurrency(dashboard.budgetUsage?.totalActualCost)} used from{' '}
            {formatCurrency(dashboard.budgetUsage?.initialBudget)}
          </Typography>
        </Stack>
      </Panel>
    </Stack>
  )
}
