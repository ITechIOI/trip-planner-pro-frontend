import Alert from '@mui/material/Alert'
import type { BudgetWarningLevel } from '@/shared'
import { getBudgetWarningText } from '../lib'

type BudgetAlertBannerProps = {
  usagePercent?: number | null
  warningLevel?: BudgetWarningLevel | null
}

export const BudgetAlertBanner = ({
  usagePercent,
  warningLevel,
}: BudgetAlertBannerProps) => {
  const message = getBudgetWarningText(warningLevel, usagePercent)

  if (!message) {
    return null
  }

  return (
    <Alert
      role="alert"
      severity={warningLevel === 'CRITICAL' ? 'error' : 'warning'}
      sx={{ borderRadius: 2 }}
    >
      {message}
    </Alert>
  )
}
