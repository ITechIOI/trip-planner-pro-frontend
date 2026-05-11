import { Box } from '@mui/material'
import { CheckCircle2, Circle, Luggage, PackageOpen } from 'lucide-react'
import { StatCard } from '@/shared/components/ui'
import { formatPercent } from '@/shared/lib/display'

type PackingProgressSummaryProps = {
  isLoading?: boolean
  hasError?: boolean
  packedCount: number
  totalCount: number
  progress: number
}

export const PackingProgressSummary = ({
  isLoading = false,
  hasError = false,
  packedCount,
  totalCount,
  progress,
}: PackingProgressSummaryProps) => {
  const unpackedCount = Math.max(0, totalCount - packedCount)

  return (
    <Box
      className="metrics-grid metrics-grid--compact"
      sx={{
        display: 'grid',
        alignItems: 'stretch',
        gap: 1.5,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
      }}
    >
      <StatCard
        label="Packing progress"
        value={isLoading ? 'Loading...' : formatPercent(progress)}
        detail={
          hasError
            ? 'Trip progress unavailable'
            : `${packedCount} of ${totalCount} packed`
        }
        icon={<Luggage size={19} />}
        progress={progress}
        progressLabel="Packing progress"
        tone="success"
      />
      <StatCard
        compact
        label="Packed"
        value={isLoading ? '...' : String(packedCount)}
        detail="Ready to go"
        icon={<CheckCircle2 size={18} />}
        tone="success"
      />
      <StatCard
        compact
        label="Unpacked"
        value={isLoading ? '...' : String(unpackedCount)}
        detail={hasError ? 'Unavailable' : 'Still open'}
        icon={<PackageOpen size={18} />}
        tone={unpackedCount > 0 ? 'warning' : 'success'}
      />
      <StatCard
        compact
        label="Total items"
        value={isLoading ? '...' : String(totalCount)}
        detail="Across checklist"
        icon={<Circle size={18} />}
        tone="info"
      />
    </Box>
  )
}
