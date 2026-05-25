import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import {
  BUDGET_CATEGORIES,
  BUDGET_PAYMENT_STATUSES,
  getBudgetCategoryLabel,
  getPaymentStatusLabel,
  type BudgetCategoryFilterValue,
  type BudgetStatusFilterValue,
} from '../lib'

type BudgetFiltersProps = {
  categoryFilter: BudgetCategoryFilterValue
  search: string
  statusFilter: BudgetStatusFilterValue
  onCategoryChange: (value: BudgetCategoryFilterValue) => void
  onClearFilters: () => void
  onSearchChange: (value: string) => void
  onStatusChange: (value: BudgetStatusFilterValue) => void
}

export const BudgetFilters = ({
  categoryFilter,
  search,
  statusFilter,
  onCategoryChange,
  onClearFilters,
  onSearchChange,
  onStatusChange,
}: BudgetFiltersProps) => {
  const hasActiveFilters = Boolean(search || categoryFilter || statusFilter)

  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      spacing={1.5}
      sx={{
        alignItems: { lg: 'center' },
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <TextField
        placeholder="Search expenses by name"
        size="small"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        sx={{ flexShrink: 0, width: { xs: '100%', lg: 420 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          },
          htmlInput: {
            'aria-label': 'Search expenses by name',
          },
        }}
      />

      <Stack
        direction="row"
        spacing={1}
        sx={{
          flex: { lg: 1 },
          flexWrap: 'wrap',
          justifyContent: { lg: 'flex-end' },
        }}
        useFlexGap
      >
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={categoryFilter}
            onChange={(event) =>
              onCategoryChange(event.target.value as BudgetCategoryFilterValue)
            }
          >
            <MenuItem value="">All Categories</MenuItem>
            {BUDGET_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {getBudgetCategoryLabel(category)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(event.target.value as BudgetStatusFilterValue)
            }
          >
            <MenuItem value="">All Statuses</MenuItem>
            {BUDGET_PAYMENT_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {getPaymentStatusLabel(status)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasActiveFilters ? (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
          >
            Clear
          </Button>
        ) : null}
      </Stack>
    </Stack>
  )
}
