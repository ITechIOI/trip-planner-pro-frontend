import {
  Button,
  FilterSelect,
  FilterToolbar,
  SearchField,
} from '@/shared/components/ui'
import {
  budgetCategoryOptions,
  paymentStatusOptions,
} from '@/shared/lib/domain'

type BudgetFiltersProps = {
  onSearchChange: (value: string) => void
  searchParams: URLSearchParams
  searchValue: string
  onFilterChange: (key: string, value: string) => void
  onReset: () => void
}

export const BudgetFilters = ({
  onSearchChange,
  searchParams,
  searchValue,
  onFilterChange,
  onReset,
}: BudgetFiltersProps) => {
  return (
    <FilterToolbar
      actions={
        <Button onClick={onReset} type="button" variant="ghost">
          Reset
        </Button>
      }
      label="Budget filters"
      sx={{
        '& .filter-toolbar__fields': {
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'minmax(260px, 1.8fr) repeat(2, minmax(132px, 0.8fr))',
            lg: 'minmax(360px, 2.2fr) repeat(2, minmax(150px, 0.75fr))',
          },
        },
        '& .MuiFormControl-root, & .MuiTextField-root': {
          minWidth: 0,
          width: '100%',
        },
        '& .MuiInputBase-root': {
          minHeight: 54,
        },
        '& .MuiInputBase-input': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      }}
    >
      <SearchField
        label="Search"
        onChange={onSearchChange}
        placeholder="Cost item"
        sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }}
        value={searchValue}
      />
      <FilterSelect
        label="Category"
        onChange={(value) => onFilterChange('category', value)}
        options={[{ label: 'All', value: '' }, ...budgetCategoryOptions]}
        value={searchParams.get('category') ?? ''}
      />
      <FilterSelect
        label="Payment status"
        onChange={(value) => onFilterChange('paymentStatus', value)}
        options={[{ label: 'All', value: '' }, ...paymentStatusOptions]}
        value={searchParams.get('paymentStatus') ?? ''}
      />
    </FilterToolbar>
  )
}
