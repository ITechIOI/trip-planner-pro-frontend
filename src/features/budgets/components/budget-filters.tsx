import {
  budgetCategoryOptions,
  paymentStatusOptions,
} from '@/shared/lib/domain'

type BudgetFiltersProps = {
  searchParams: URLSearchParams
  onFilterChange: (key: string, value: string) => void
}

export const BudgetFilters = ({
  searchParams,
  onFilterChange,
}: BudgetFiltersProps) => {
  return (
    <div className="filter-toolbar" aria-label="Budget filters">
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
          {budgetCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Payment status</span>
        <select
          value={searchParams.get('paymentStatus') ?? ''}
          onChange={(event) =>
            onFilterChange('paymentStatus', event.target.value)
          }
        >
          <option value="">All</option>
          {paymentStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
