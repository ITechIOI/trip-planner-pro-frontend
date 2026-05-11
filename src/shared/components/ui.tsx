import {
  Alert,
  Box,
  Button as MuiButton,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton as MuiIconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Skeleton as MuiSkeleton,
  Stack,
  TextField,
  Typography,
  type ButtonProps as MuiButtonProps,
  type IconButtonProps as MuiIconButtonProps,
  type SxProps,
  type Theme,
} from '@mui/material'
import { Search, X } from 'lucide-react'
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react'
import { tripPlannerColors } from '@/app/theme'

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'critical'
type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const toneColors: Record<
  Tone,
  { color: string; background: string; border: string }
> = {
  neutral: {
    color: tripPlannerColors.muted,
    background: tripPlannerColors.surface,
    border: tripPlannerColors.border,
  },
  info: {
    color: tripPlannerColors.primaryStrong,
    background: '#E0F2FE',
    border: '#BAE6FD',
  },
  success: {
    color: '#15803D',
    background: '#DCFCE7',
    border: '#BBF7D0',
  },
  warning: {
    color: '#92400E',
    background: '#FEF3C7',
    border: '#FDE68A',
  },
  critical: {
    color: '#B91C1C',
    background: '#FEE2E2',
    border: '#FECACA',
  },
}

const progressColors: Record<Exclude<Tone, 'neutral'>, string> = {
  info: tripPlannerColors.primary,
  success: tripPlannerColors.success,
  warning: tripPlannerColors.warning,
  critical: tripPlannerColors.critical,
}

const mergeSx = (
  base: SxProps<Theme>,
  sx?: SxProps<Theme>,
): SxProps<Theme> => {
  if (!sx) {
    return base
  }

  return (Array.isArray(sx) ? [base, ...sx] : [base, sx]) as SxProps<Theme>
}

type ButtonProps = Omit<MuiButtonProps, 'variant' | 'color'> & {
  variant?: AppButtonVariant
  component?: ElementType
  to?: string
}

export const Button = ({
  className = '',
  variant = 'secondary',
  sx,
  ...props
}: ButtonProps) => {
  const buttonStyles: Record<AppButtonVariant, SxProps<Theme>> = {
    primary: {
      color: '#FFFFFF',
      bgcolor: tripPlannerColors.cta,
      borderColor: tripPlannerColors.cta,
      '&:hover': {
        color: '#FFFFFF',
        bgcolor: tripPlannerColors.ctaHover,
        borderColor: tripPlannerColors.ctaHover,
      },
      '&.Mui-disabled': {
        color: 'rgba(255, 255, 255, 0.76)',
        bgcolor: '#FDBA74',
        borderColor: '#FDBA74',
      },
    },
    secondary: {
      color: tripPlannerColors.ink,
      bgcolor: tripPlannerColors.surface,
      borderColor: tripPlannerColors.border,
      '&:hover': {
        borderColor: '#BAE6FD',
        bgcolor: tripPlannerColors.surface,
        boxShadow: '0 8px 24px rgba(14, 165, 233, 0.12)',
      },
    },
    ghost: {
      color: tripPlannerColors.muted,
      bgcolor: 'transparent',
      borderColor: 'transparent',
      '&:hover': {
        color: tripPlannerColors.ink,
        bgcolor: tripPlannerColors.surfaceSoft,
      },
    },
    danger: {
      color: '#991B1B',
      bgcolor: '#FFF1F2',
      borderColor: '#FECDD3',
      '&:hover': {
        bgcolor: '#FFE4E6',
        borderColor: '#FDA4AF',
      },
    },
  }

  return (
    <MuiButton
      {...props}
      className={`button button--${variant} ${className}`.trim()}
      variant={variant === 'ghost' ? 'text' : 'outlined'}
      sx={mergeSx(
        {
          gap: 1,
          px: 2,
          fontWeight: 800,
          lineHeight: 1,
          ...buttonStyles[variant],
        },
        sx,
      )}
    />
  )
}

export const IconButton = forwardRef<HTMLButtonElement, MuiIconButtonProps>(
  ({ className = '', sx, ...props }, ref) => {
  return (
    <MuiIconButton
      {...props}
      className={`icon-button ${className}`.trim()}
      ref={ref}
      sx={mergeSx(
        {
          width: 40,
          height: 40,
          color: tripPlannerColors.ink,
          bgcolor: tripPlannerColors.surface,
          border: `1px solid ${tripPlannerColors.border}`,
          '&:hover': {
            borderColor: '#BAE6FD',
            bgcolor: tripPlannerColors.surface,
            boxShadow: '0 8px 24px rgba(14, 165, 233, 0.12)',
          },
        },
        sx,
      )}
    />
  )
  },
)

export const Badge = ({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: Tone
}) => {
  const colors = toneColors[tone]

  return (
    <Chip
      className={`badge badge--${tone}`}
      label={
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          {children}
        </Box>
      }
      size="small"
      sx={{
        minHeight: 24,
        borderRadius: 999,
        color: colors.color,
        bgcolor: colors.background,
        border: `1px solid ${colors.border}`,
        fontSize: 12,
        fontWeight: 800,
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  )
}

export const ProgressBar = ({
  value,
  tone = 'info',
  label = 'Progress',
}: {
  value?: number | null
  tone?: Exclude<Tone, 'neutral'>
  label?: string
}) => {
  const safeValue = Math.max(0, Math.min(100, Math.round(value ?? 0)))

  return (
    <LinearProgress
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      className="progress"
      variant="determinate"
      value={safeValue}
      sx={{
        height: 10,
        borderRadius: 999,
        bgcolor: tripPlannerColors.border,
        '& .MuiLinearProgress-bar': {
          borderRadius: 999,
          bgcolor: progressColors[tone],
        },
      }}
    />
  )
}

export const StatCard = ({
  label,
  value,
  detail,
  icon,
  progress,
  progressLabel,
  progressTone,
  tone = 'neutral',
  compact = false,
  action,
}: {
  label: string
  value: string
  detail?: string
  icon?: ReactNode
  progress?: number | null
  progressLabel?: string
  progressTone?: Exclude<Tone, 'neutral'>
  tone?: Tone
  compact?: boolean
  action?: ReactNode
}) => {
  const colors = toneColors[tone]
  const safeProgressTone =
    progressTone ?? (tone === 'neutral' ? 'info' : tone)

  return (
    <Paper
      className={`stat-card stat-card--${tone}`}
      component="article"
      variant="outlined"
      sx={{
        display: 'grid',
        gap: compact ? 0.75 : 1,
        p: compact ? 1.5 : 2,
        minWidth: 0,
        borderColor: tripPlannerColors.border,
        borderTop: `3px solid ${colors.color}`,
        borderRadius: 2,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
      }}
    >
      <Stack
        direction="row"
        spacing={1.25}
        sx={{ alignItems: 'flex-start', justifyContent: 'space-between', minWidth: 0 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography color="text.secondary" sx={{ fontSize: 12.5, fontWeight: 800 }}>
            {label}
          </Typography>
          <Typography
            component="strong"
            sx={{
              color: tripPlannerColors.ink,
              display: 'block',
              fontSize: compact ? '1.35rem' : '1.875rem',
              fontWeight: 850,
              lineHeight: 1.08,
              mt: 0.5,
            }}
          >
            {value}
          </Typography>
        </Box>
        {icon ? (
          <Box
            aria-hidden="true"
            className="stat-card__icon"
            sx={{
              alignItems: 'center',
              bgcolor: colors.background,
              border: `1px solid ${colors.border}`,
              borderRadius: 2,
              color: colors.color,
              display: 'inline-flex',
              flex: '0 0 auto',
              height: compact ? 34 : 40,
              justifyContent: 'center',
              width: compact ? 34 : 40,
            }}
          >
            {icon}
          </Box>
        ) : null}
      </Stack>
      {detail ? (
        <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 500 }}>
          {detail}
        </Typography>
      ) : null}
      {progress != null ? (
        <ProgressBar
          label={progressLabel ?? `${label} progress`}
          tone={safeProgressTone}
          value={progress}
        />
      ) : null}
      {action ? <Box sx={{ mt: 0.25 }}>{action}</Box> : null}
    </Paper>
  )
}

export const Panel = ({
  title,
  description,
  action,
  icon,
  children,
  className = '',
  sx,
}: {
  title?: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
  children: ReactNode
  className?: string
  sx?: SxProps<Theme>
}) => {
  return (
    <Paper
      className={`panel ${className}`.trim()}
      component="section"
      variant="outlined"
      sx={mergeSx(
        {
          borderColor: tripPlannerColors.border,
          borderRadius: 2,
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
          minWidth: 0,
          overflow: 'hidden',
        },
        sx,
      )}
    >
      {title || description || action ? (
        <Stack
          className="panel__header"
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{
            alignItems: { xs: 'stretch', sm: 'flex-start' },
            borderBottom: `1px solid ${tripPlannerColors.border}`,
            justifyContent: 'space-between',
            px: 2,
            py: 1.75,
          }}
        >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'flex-start', minWidth: 0 }}>
            {icon ? (
              <CategoryIcon icon={icon} label="" size="sm" tone="info" />
            ) : null}
            <Box sx={{ minWidth: 0 }}>
              {title ? (
                <Typography component="h2" variant="h2">
                  {title}
                </Typography>
              ) : null}
              {description ? (
                <Typography color="text.secondary" sx={{ fontSize: 13, mt: 0.5 }}>
                  {description}
                </Typography>
              ) : null}
            </Box>
          </Stack>
          {action ? <Box className="panel__action">{action}</Box> : null}
        </Stack>
      ) : null}
      <Box className="panel__body" sx={{ p: 2 }}>
        {children}
      </Box>
    </Paper>
  )
}

export const FilterToolbar = ({
  label,
  children,
  actions,
  className = '',
  sx,
}: {
  label: string
  children: ReactNode
  actions?: ReactNode
  className?: string
  sx?: SxProps<Theme>
}) => {
  return (
    <Paper
      aria-label={label}
      className={`filter-toolbar ${className}`.trim()}
      role="group"
      variant="outlined"
      sx={mergeSx(
        {
          alignItems: { xs: 'stretch', md: 'center' },
          borderColor: tripPlannerColors.border,
          borderRadius: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 1.25,
          p: 1.25,
        },
        sx,
      )}
    >
      <Box
        className="filter-toolbar__fields"
        sx={{
          display: 'grid',
          flex: '1 1 auto',
          gap: 1,
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(auto-fit, minmax(150px, 1fr))',
          },
          minWidth: 0,
        }}
      >
        {children}
      </Box>
      {actions ? (
        <Stack
          className="filter-toolbar__actions"
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ flex: '0 0 auto' }}
        >
          {actions}
        </Stack>
      ) : null}
    </Paper>
  )
}

export const SearchField = ({
  label = 'Search',
  placeholder,
  value,
  onChange,
  sx,
}: {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  sx?: SxProps<Theme>
}) => {
  return (
    <TextField
      label={label}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search aria-hidden="true" size={16} />
            </InputAdornment>
          ),
        },
      }}
      sx={sx}
      type="search"
      value={value}
    />
  )
}

export const FilterSelect = ({
  label,
  options,
  value,
  onChange,
  sx,
}: {
  label: string
  options: Array<{ label: string; value: string }>
  value: string
  onChange: (value: string) => void
  sx?: SxProps<Theme>
}) => {
  return (
    <TextField
      label={label}
      onChange={(event) => onChange(event.target.value)}
      select
      slotProps={{
        inputLabel: { shrink: true },
        select: { native: true },
      }}
      sx={sx}
      value={value}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </TextField>
  )
}

export const StatusBadge = ({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: Tone
}) => {
  return <Badge tone={tone}>{children}</Badge>
}

export const CategoryIcon = ({
  icon,
  label,
  tone = 'neutral',
  size = 'md',
}: {
  icon: ReactNode
  label: string
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
}) => {
  const colors = toneColors[tone]
  const dimensions = {
    sm: 30,
    md: 38,
    lg: 46,
  }[size]

  return (
    <Box
      aria-label={label || undefined}
      className={`category-icon category-icon--${tone}`}
      role={label ? 'img' : undefined}
      sx={{
        alignItems: 'center',
        bgcolor: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        color: colors.color,
        display: 'inline-flex',
        flex: '0 0 auto',
        height: dimensions,
        justifyContent: 'center',
        width: dimensions,
      }}
    >
      {icon}
    </Box>
  )
}

export const ActionCluster = ({
  children,
  align = 'end',
}: {
  children: ReactNode
  align?: 'start' | 'end'
}) => {
  return (
    <Stack
      className="action-cluster"
      direction="row"
      spacing={1}
      sx={{
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        justifyContent: align === 'start' ? 'flex-start' : 'flex-end',
        minWidth: 0,
      }}
    >
      {children}
    </Stack>
  )
}

export const EmptyIllustration = ({
  src,
  alt = '',
}: {
  src: string
  alt?: string
}) => {
  return (
    <Box
      alt={alt}
      className="empty-illustration"
      component="img"
      src={src}
      sx={{
        height: 132,
        maxWidth: '100%',
        objectFit: 'contain',
        width: 180,
      }}
    />
  )
}

export const EmptyState = ({
  title,
  description,
  action,
  illustration,
}: {
  title: string
  description: string
  action?: ReactNode
  illustration?: ReactNode
}) => {
  return (
    <Paper
      className="empty-state"
      variant="outlined"
      sx={{
        display: 'grid',
        justifyItems: 'start',
        gap: 1.5,
        p: 3.5,
        borderColor: tripPlannerColors.border,
      }}
    >
      {illustration ? <Box>{illustration}</Box> : null}
      <Typography component="h3" variant="h3">
        {title}
      </Typography>
      <Typography color="text.secondary">{description}</Typography>
      {action ? <Box>{action}</Box> : null}
    </Paper>
  )
}

export const ErrorState = ({
  title = 'Something went wrong',
  description,
  action,
}: {
  title?: string
  description?: string
  action?: ReactNode
}) => {
  return (
    <Alert
      action={action}
      className="error-state"
      role="alert"
      severity="error"
      sx={{
        alignItems: 'center',
        border: `1px solid ${toneColors.critical.border}`,
        borderRadius: 2,
      }}
    >
      <Typography component="h3" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      <Typography>{description ?? 'Please retry when the connection is available.'}</Typography>
    </Alert>
  )
}

export const Skeleton = ({ rows = 3 }: { rows?: number }) => {
  return (
    <Stack aria-label="Loading content" className="skeleton-stack" spacing={1.5}>
      {Array.from({ length: rows }).map((_, index) => (
        <MuiSkeleton
          className="skeleton"
          height={68}
          key={index}
          sx={{ borderRadius: 2 }}
          variant="rounded"
        />
      ))}
    </Stack>
  )
}

export const FieldError = ({ message }: { message?: string }) => {
  if (!message) {
    return null
  }

  return (
    <Typography
      className="field-error"
      color="error"
      component="span"
      role="alert"
      sx={{ fontSize: 13, fontWeight: 700 }}
    >
      {message}
    </Typography>
  )
}

export const PageHeader = ({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) => {
  return (
    <Box
      className="page-header"
      component="header"
      sx={{
        display: 'flex',
        alignItems: { xs: 'stretch', sm: 'flex-end' },
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2.25,
      }}
    >
      <Box>
        <Typography component="h1" variant="h1">
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      </Box>
      {action ? <Box className="page-header__action">{action}</Box> : null}
    </Box>
  )
}

export const AppDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
}) => {
  const titleId = useId()
  const descriptionId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus()
    })

    return () => window.clearTimeout(focusTimer)
  }, [open])

  return (
    <Dialog
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="md"
      onClose={() => onOpenChange(false)}
      open={open}
      slotProps={{
        paper: {
          className: 'dialog-content',
          sx: {
            borderRadius: 2,
            border: `1px solid ${tripPlannerColors.border}`,
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
          },
        },
      }}
    >
      <Stack
        className="dialog-heading"
        direction="row"
        spacing={2}
        sx={{ alignItems: 'flex-start', justifyContent: 'space-between', px: 3, pt: 2.75 }}
      >
        <Box>
          <DialogTitle id={titleId} sx={{ p: 0, fontWeight: 800 }}>
            {title}
          </DialogTitle>
          {description ? (
            <Typography color="text.secondary" id={descriptionId} sx={{ mt: 0.75 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        <IconButton
          aria-label="Close dialog"
          onClick={() => onOpenChange(false)}
          ref={closeButtonRef}
          type="button"
        >
          <X size={18} />
        </IconButton>
      </Stack>
      <DialogContent sx={{ px: 3, pb: 3, pt: 2 }}>{children}</DialogContent>
    </Dialog>
  )
}

export const PaginationControls = ({
  offset,
  limit,
  total,
  disabled = false,
  onOffsetChange,
}: {
  offset?: number
  limit?: number
  total?: number
  disabled?: boolean
  onOffsetChange: (offset: number) => void
}) => {
  const safeOffset = Math.max(0, offset ?? 0)
  const safeLimit = Math.max(1, limit ?? 1)
  const safeTotal = Math.max(0, total ?? 0)

  if (safeTotal <= safeLimit) {
    return null
  }

  const start = safeOffset + 1
  const end = Math.min(safeOffset + safeLimit, safeTotal)
  const previousOffset = Math.max(0, safeOffset - safeLimit)
  const nextOffset = safeOffset + safeLimit

  return (
    <Paper
      aria-label="Pagination"
      className="pagination-controls"
      component="nav"
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        p: 1.5,
        borderColor: tripPlannerColors.border,
      }}
    >
      <Typography
        className="pagination-controls__summary"
        color="text.secondary"
        sx={{ fontSize: 13, fontWeight: 800 }}
      >
        Showing {start}-{end} of {safeTotal}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Button
          disabled={disabled || safeOffset === 0}
          onClick={() => onOffsetChange(previousOffset)}
          type="button"
        >
          Previous
        </Button>
        <Button
          disabled={disabled || nextOffset >= safeTotal}
          onClick={() => onOffsetChange(nextOffset)}
          type="button"
        >
          Next
        </Button>
      </Stack>
    </Paper>
  )
}
