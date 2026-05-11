import {
  Button,
  FilterSelect,
  FilterToolbar,
  SearchField,
} from '@/shared/components/ui'
import {
  packedStatusOptions,
  packingCategoryOptions,
} from '@/shared/lib/domain'

type PackingFiltersProps = {
  onSearchChange: (value: string) => void
  searchParams: URLSearchParams
  searchValue: string
  onFilterChange: (key: string, value: string) => void
  onReset: () => void
}

export const PackingFilters = ({
  onSearchChange,
  searchParams,
  searchValue,
  onFilterChange,
  onReset,
}: PackingFiltersProps) => {
  return (
    <FilterToolbar
      actions={
        <Button onClick={onReset} type="button" variant="ghost">
          Reset
        </Button>
      }
      label="Packing filters"
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
        placeholder="Item name"
        sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }}
        value={searchValue}
      />
      <FilterSelect
        label="Category"
        onChange={(value) => onFilterChange('category', value)}
        options={[{ label: 'All', value: '' }, ...packingCategoryOptions]}
        value={searchParams.get('category') ?? ''}
      />
      <FilterSelect
        label="Packed status"
        onChange={(value) => onFilterChange('packedStatus', value)}
        options={[{ label: 'All', value: '' }, ...packedStatusOptions]}
        value={searchParams.get('packedStatus') ?? ''}
      />
    </FilterToolbar>
  )
}
