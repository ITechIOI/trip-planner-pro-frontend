import { Box } from '@mui/material'
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import dayjs, { type Dayjs } from 'dayjs'
import {
  Button,
  FilterSelect,
  FilterToolbar,
  SearchField,
} from '@/shared/components/ui'
import {
  itineraryCategoryOptions,
  itineraryPriorityOptions,
  itineraryStatusOptions,
} from '@/shared/lib/domain'

type ItineraryFiltersProps = {
  onSearchChange: (value: string) => void
  searchParams: URLSearchParams
  searchValue: string
  onFilterChange: (key: string, value: string) => void
  onReset: () => void
}

const toPickerDate = (value: string) => (value ? dayjs(value) : null)

const fromPickerDate = (value: Dayjs | null) =>
  value?.isValid() ? value.format('YYYY-MM-DD') : ''

const toPickerTime = (value: string) =>
  value ? dayjs(`2000-01-01T${value}`) : null

const fromPickerTime = (value: Dayjs | null) =>
  value?.isValid() ? value.format('HH:mm') : ''

export const ItineraryFilters = ({
  onSearchChange,
  searchParams,
  searchValue,
  onFilterChange,
  onReset,
}: ItineraryFiltersProps) => {
  return (
    <FilterToolbar
      actions={
        <Button onClick={onReset} type="button" variant="ghost">
          Reset
        </Button>
      }
      className="filter-toolbar--itinerary"
      label="Itinerary filters"
      sx={{
        alignItems: { xs: 'stretch', md: 'flex-start' },
        '& .filter-toolbar__fields': {
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'minmax(240px, 1.5fr) minmax(150px, 0.9fr)',
            md: 'minmax(260px, 1.8fr) repeat(3, minmax(118px, 0.8fr))',
            lg: 'minmax(240px, 1.7fr) minmax(154px, 0.95fr) repeat(2, minmax(116px, 0.75fr)) repeat(3, minmax(92px, 0.65fr))',
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
        '& .filter-toolbar__actions': {
          minHeight: { md: 54 },
          alignItems: { md: 'center' },
        },
      }}
    >
      <SearchField
        label="Search"
        onChange={onSearchChange}
        placeholder="Activity or place"
        sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}
        value={searchValue}
      />
      <DatePicker
        format="YYYY-MM-DD"
        label="Date"
        onChange={(value) => onFilterChange('date', fromPickerDate(value))}
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
        value={toPickerDate(searchParams.get('date') ?? '')}
      />
      <Box sx={{ display: { xs: 'none', sm: 'contents' } }}>
        <TimePicker
          ampm={false}
          format="HH:mm"
          label="Start time"
          onChange={(value) => onFilterChange('startClock', fromPickerTime(value))}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
          value={toPickerTime(searchParams.get('startClock') ?? '')}
        />
        <TimePicker
          ampm={false}
          format="HH:mm"
          label="End time"
          onChange={(value) => onFilterChange('endClock', fromPickerTime(value))}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
          value={toPickerTime(searchParams.get('endClock') ?? '')}
        />
        <FilterSelect
          label="Category"
          onChange={(value) => onFilterChange('category', value)}
          options={[{ label: 'All', value: '' }, ...itineraryCategoryOptions]}
          value={searchParams.get('category') ?? ''}
        />
        <FilterSelect
          label="Status"
          onChange={(value) => onFilterChange('status', value)}
          options={[{ label: 'All', value: '' }, ...itineraryStatusOptions]}
          value={searchParams.get('status') ?? ''}
        />
        <FilterSelect
          label="Priority"
          onChange={(value) => onFilterChange('priority', value)}
          options={[{ label: 'All', value: '' }, ...itineraryPriorityOptions]}
          value={searchParams.get('priority') ?? ''}
        />
      </Box>
    </FilterToolbar>
  )
}
