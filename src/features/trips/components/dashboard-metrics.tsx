import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import type { TripDashboardResponse } from '@/shared'
import {
  clampDashboardPercent,
  formatDashboardCurrency,
  formatDashboardPercent,
  getBudgetWarningTone,
  type DashboardTone,
} from '../lib/dashboard-fields'

export type DashboardMetricsProps = {
  dashboard: TripDashboardResponse
}

type MetricCardProps = {
  label: string
  value: string
  detail: string
  icon: SvgIconComponent
  tone: DashboardTone
  progress?: number | null
}

const toneIconBackground: Record<DashboardTone, string> = {
  primary: 'rgba(25, 118, 210, 0.1)',
  success: 'rgba(46, 125, 50, 0.1)',
  warning: 'rgba(237, 108, 2, 0.12)',
  error: 'rgba(211, 47, 47, 0.1)',
  info: 'rgba(2, 136, 209, 0.1)',
}

const MetricCard = ({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  progress,
}: MetricCardProps) => {
  const progressValue =
    progress === undefined || progress === null
      ? null
      : clampDashboardPercent(progress)

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        height: '100%',
        minHeight: 154,
      }}
    >
      <Stack spacing={1.5} sx={{ height: '100%' }}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              {label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: toneIconBackground[tone],
              color: `${tone}.main`,
              flexShrink: 0,
            }}
          >
            <Icon fontSize="small" />
          </Box>
        </Stack>

        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
          {detail}
        </Typography>

        {progressValue !== null ? (
          <LinearProgress
            aria-label={`${label} progress`}
            color={tone}
            value={progressValue}
            variant="determinate"
            sx={{ mt: 'auto', height: 7, borderRadius: 999 }}
          />
        ) : null}
      </Stack>
    </Paper>
  )
}

export const DashboardMetrics = ({ dashboard }: DashboardMetricsProps) => {
  const itineraryProgress = dashboard.itineraryProgress
  const packingProgress = dashboard.packingProgress
  const budgetUsage = dashboard.budgetUsage
  const budgetTone = getBudgetWarningTone(budgetUsage?.warningLevel)
  const overdueCount = dashboard.overdueActivityCount ?? 0

  return (
    <Box
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
      <MetricCard
        label="Itinerary complete"
        value={formatDashboardPercent(itineraryProgress?.percent)}
        detail={`${itineraryProgress?.done ?? 0}/${
          itineraryProgress?.total ?? 0
        } activities done`}
        icon={CalendarMonthOutlinedIcon}
        tone="info"
        progress={itineraryProgress?.percent}
      />
      <MetricCard
        label="Packing complete"
        value={formatDashboardPercent(packingProgress?.percent)}
        detail={`${packingProgress?.packed ?? 0}/${
          packingProgress?.total ?? 0
        } items packed`}
        icon={ChecklistOutlinedIcon}
        tone="success"
        progress={packingProgress?.percent}
      />
      <MetricCard
        label="Budget used"
        value={formatDashboardPercent(budgetUsage?.percent)}
        detail={`${formatDashboardCurrency(
          budgetUsage?.totalActualCost,
        )} of ${formatDashboardCurrency(budgetUsage?.initialBudget)}`}
        icon={AccountBalanceWalletOutlinedIcon}
        tone={budgetTone}
        progress={budgetUsage?.percent}
      />
      <MetricCard
        label="Unpaid items"
        value={String(dashboard.unpaidBudgetItemCount ?? 0)}
        detail="Budget items still unpaid"
        icon={ReceiptLongOutlinedIcon}
        tone="warning"
      />
      <MetricCard
        label="Overdue activities"
        value={String(overdueCount)}
        detail={overdueCount > 0 ? 'Need attention now' : 'No overdue activity'}
        icon={WarningAmberOutlinedIcon}
        tone={overdueCount > 0 ? 'error' : 'success'}
      />
    </Box>
  )
}
