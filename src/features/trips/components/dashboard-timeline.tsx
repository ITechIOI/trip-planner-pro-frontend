import { Clock4 } from 'lucide-react'
import type { TripDashboardResponse } from '@/shared'
import { EmptyState } from '@/shared/components/ui'
import { getItineraryStatusLabel } from '@/shared/lib/domain'
import {
  formatDate,
  formatDateTime,
  isItineraryOverdue,
} from '@/shared/lib/display'

type DashboardTimelineProps = {
  dashboard: TripDashboardResponse
}

export const DashboardTimeline = ({ dashboard }: DashboardTimelineProps) => {
  return (
    <article className="panel panel--large">
      <div className="panel__header">
        <div>
          <h2>Itinerary by date</h2>
          <p>Timeline grouped by travel day.</p>
        </div>
        <Clock4 size={20} />
      </div>

      {dashboard.itinerariesByDate?.length ? (
        <div className="timeline">
          {dashboard.itinerariesByDate.map((group) => (
            <section className="timeline-group" key={group.date ?? 'none'}>
              <h3>{formatDate(group.date)}</h3>
              <div className="timeline-list">
                {(group.items ?? []).map((item) => {
                  const overdue = isItineraryOverdue(item)

                  return (
                    <article
                      className={`timeline-item ${
                        overdue ? 'timeline-item--overdue' : ''
                      }`}
                      key={item.id}
                    >
                      <div>
                        <strong>{item.activityTitle}</strong>
                        <span>{formatDateTime(item.startTime)}</span>
                      </div>
                      <span>
                        {getItineraryStatusLabel(item.status)}
                        {overdue ? ' - Overdue' : ''}
                      </span>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No itinerary items yet"
          description="Add activities to see the trip timeline grouped by date."
        />
      )}
    </article>
  )
}
