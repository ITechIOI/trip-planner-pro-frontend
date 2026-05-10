import {
  itineraryCategoryOptions,
  itineraryPriorityOptions,
  itineraryStatusOptions,
} from '@/shared/lib/domain'

type ItineraryFiltersProps = {
  searchParams: URLSearchParams
  onFilterChange: (key: string, value: string) => void
}

export const ItineraryFilters = ({
  searchParams,
  onFilterChange,
}: ItineraryFiltersProps) => {
  return (
    <div className="filter-toolbar" aria-label="Itinerary filters">
      <label>
        <span>Search</span>
        <input
          type="search"
          value={searchParams.get('search') ?? ''}
          onChange={(event) => onFilterChange('search', event.target.value)}
        />
      </label>
      <label>
        <span>Date</span>
        <input
          type="date"
          value={searchParams.get('date') ?? ''}
          onChange={(event) => onFilterChange('date', event.target.value)}
        />
      </label>
      <label>
        <span>Start time</span>
        <input
          type="time"
          value={searchParams.get('startClock') ?? ''}
          onChange={(event) => onFilterChange('startClock', event.target.value)}
        />
      </label>
      <label>
        <span>End time</span>
        <input
          type="time"
          value={searchParams.get('endClock') ?? ''}
          onChange={(event) => onFilterChange('endClock', event.target.value)}
        />
      </label>
      <label>
        <span>Category</span>
        <select
          value={searchParams.get('category') ?? ''}
          onChange={(event) => onFilterChange('category', event.target.value)}
        >
          <option value="">All</option>
          {itineraryCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Status</span>
        <select
          value={searchParams.get('status') ?? ''}
          onChange={(event) => onFilterChange('status', event.target.value)}
        >
          <option value="">All</option>
          {itineraryStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Priority</span>
        <select
          value={searchParams.get('priority') ?? ''}
          onChange={(event) => onFilterChange('priority', event.target.value)}
        >
          <option value="">All</option>
          {itineraryPriorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
