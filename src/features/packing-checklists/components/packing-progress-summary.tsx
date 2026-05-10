import { ProgressBar, StatCard } from '@/shared/components/ui'
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
  return (
    <div className="metrics-grid metrics-grid--compact">
      <StatCard
        label="Packing progress"
        value={isLoading ? 'Loading...' : formatPercent(progress)}
        detail={
          hasError
            ? 'Trip progress unavailable'
            : `${packedCount} of ${totalCount} packed`
        }
        tone="success"
      />
      <article className="panel panel--progress">
        <ProgressBar value={progress} tone="success" />
      </article>
    </div>
  )
}
