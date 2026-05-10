import {
  packedStatusOptions,
  packingCategoryOptions,
} from '@/shared/lib/domain'

type PackingFiltersProps = {
  searchParams: URLSearchParams
  onFilterChange: (key: string, value: string) => void
}

export const PackingFilters = ({
  searchParams,
  onFilterChange,
}: PackingFiltersProps) => {
  return (
    <div className="filter-toolbar" aria-label="Packing filters">
      <label>
        <span>Search</span>
        <input
          type="search"
          value={searchParams.get('search') ?? ''}
          onChange={(event) => onFilterChange('search', event.target.value)}
        />
      </label>
      <label>
        <span>Category</span>
        <select
          value={searchParams.get('category') ?? ''}
          onChange={(event) => onFilterChange('category', event.target.value)}
        >
          <option value="">All</option>
          {packingCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Packed status</span>
        <select
          value={searchParams.get('packedStatus') ?? ''}
          onChange={(event) => onFilterChange('packedStatus', event.target.value)}
        >
          <option value="">All</option>
          {packedStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
