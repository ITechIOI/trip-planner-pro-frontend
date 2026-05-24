import type { CategoryFilter, StatusFilter } from '../types/budget.types';
import { CATEGORIES } from '../helpers/budget.constants';

interface ExpenseFiltersProps {
  search: string;
  categoryFilter: CategoryFilter;
  statusFilter: StatusFilter;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: CategoryFilter) => void;
  onStatusChange: (value: StatusFilter) => void;
}

const selectClass =
  'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300';

export function ExpenseFilters({
  search,
  categoryFilter,
  statusFilter,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: ExpenseFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Search */}
      <div className="relative min-w-[160px] flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search expenses..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          aria-label="Search expenses by name"
        />
      </div>

      {/* Category filter */}
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
        className={selectClass}
        aria-label="Filter by category"
      >
        <option value="ALL">All categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0) + cat.slice(1).toLowerCase()}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
        className={selectClass}
        aria-label="Filter by payment status"
      >
        <option value="ALL">All statuses</option>
        <option value="PAID">PAID</option>
        <option value="UNPAID">UNPAID</option>
      </select>
    </div>
  );
}
