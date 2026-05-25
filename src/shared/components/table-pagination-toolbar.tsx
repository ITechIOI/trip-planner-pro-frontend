import type { ChangeEvent } from 'react'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

export type TablePaginationToolbarProps = {
  currentOffset: number
  currentPage: number
  isFetching?: boolean
  limit: number
  pageCount: number
  total: number
  onPageChange: (page: number) => void
}

export const TablePaginationToolbar = ({
  currentOffset,
  currentPage,
  isFetching = false,
  limit,
  pageCount,
  total,
  onPageChange,
}: TablePaginationToolbarProps) => {
  const rangeStart = total === 0 ? 0 : currentOffset + 1
  const rangeEnd = Math.min(currentOffset + limit, total)
  const canGoPrevious = currentPage > 1 && !isFetching
  const canGoNext = currentPage < pageCount && !isFetching

  const handlePageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPage = Number(event.target.value)

    if (!Number.isInteger(nextPage)) {
      return
    }

    onPageChange(Math.min(Math.max(nextPage, 1), pageCount))
  }

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        px: 2,
        py: 1.25,
      }}
    >
      <Typography color="text.secondary" variant="body2">
        {rangeStart} - {rangeEnd} of {total}
      </Typography>

      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <Tooltip title="First page">
          <span>
            <IconButton
              size="small"
              aria-label="First page"
              disabled={!canGoPrevious}
              onClick={() => onPageChange(1)}
            >
              <FirstPageIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Previous page">
          <span>
            <IconButton
              size="small"
              aria-label="Previous page"
              disabled={!canGoPrevious}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <KeyboardArrowLeftIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <TextField
          type="number"
          size="small"
          value={currentPage}
          onChange={handlePageInputChange}
          sx={{ width: 64 }}
          slotProps={{
            htmlInput: {
              'aria-label': 'Page number',
              min: 1,
              max: pageCount,
            },
          }}
        />
        <Typography color="text.secondary" variant="body2">
          of {pageCount}
        </Typography>

        <Tooltip title="Next page">
          <span>
            <IconButton
              size="small"
              aria-label="Next page"
              disabled={!canGoNext}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <KeyboardArrowRightIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Last page">
          <span>
            <IconButton
              size="small"
              aria-label="Last page"
              disabled={!canGoNext}
              onClick={() => onPageChange(pageCount)}
            >
              <LastPageIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  )
}
