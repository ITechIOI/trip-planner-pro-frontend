import { AppLayout } from '@/components/ui/app-layout'
import { useTrip } from '@/lib/trip-context'
import { ProgressRing } from '@/components/dashboard/progress-ring'

function DashboardContent() {
  const { state, stats, formatCurrency } = useTrip()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of {state.trip.tripName} — {state.trip.destination}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <ProgressRing progress={stats.itineraryCompletionPercentage} size={64} />
            <div>
              <p className="text-sm text-muted-foreground">Itinerary</p>
              <p className="text-2xl font-bold">
                {stats.completedActivities}/{stats.totalActivities}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Packing</p>
          <p className="text-2xl font-bold">{stats.packingCompletionPercentage}%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Budget remaining</p>
          <p className="text-2xl font-bold">{formatCurrency(stats.remainingBudget)}</p>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  )
}
