import SearchIcon from '@mui/icons-material/Search'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { PackedStatus } from '@/shared'
import { PACKING_CATEGORY_OPTIONS } from '../lib/packing-category-meta'
import type { PackedStatus as PackedStatusValue } from '../types/packing-item'
import type { PackingCategory } from '../types/packing-item'

type PackingFiltersProps = {
  searchTerm: string
  categoryFilter: PackingCategory | ''
  packedFilter: PackedStatusValue | ''
  onSearchChange: (value: string) => void
  onCategoryChange: (value: PackingCategory | '') => void
  onPackedChange: (value: PackedStatusValue | '') => void
}

export const PackingFilters = ({
  searchTerm,
  categoryFilter,
  packedFilter,
  onSearchChange,
  onCategoryChange,
  onPackedChange,
}: PackingFiltersProps) => {
  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      spacing={2}
      sx={{
        alignItems: { lg: 'center' },
        justifyContent: { lg: 'space-between' },
        width: '100%',
      }}
    >
      <TextField
        label="Search"
        placeholder="Search items by name"
        size="small"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        sx={{
          width: { xs: '100%', lg: 420 },
          flexShrink: 0,
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          flex: { lg: 1 },
          justifyContent: { lg: 'flex-end' },
          width: { xs: '100%', lg: 'auto' },
        }}
      >
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={categoryFilter}
            onChange={(event) =>
              onCategoryChange(event.target.value as PackingCategory | '')
            }
          >
            <MenuItem value="">All Categories</MenuItem>
            {PACKING_CATEGORY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={packedFilter}
            onChange={(event) =>
              onPackedChange(event.target.value as PackedStatusValue | '')
            }
          >
            <MenuItem value="">All Items</MenuItem>
            <MenuItem value={PackedStatus.PACKED}>Packed</MenuItem>
            <MenuItem value={PackedStatus.NOT_PACKED}>Not Packed</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  )
}
