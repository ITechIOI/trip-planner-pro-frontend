import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { SvgIconComponent } from '@mui/icons-material'
import { formatBudgetCurrency } from '../lib'

type BudgetSummaryCardsProps = {
  canManageBudget: boolean
  initialBudget?: number | null
  remainingBudget?: number | null
  totalActualCost?: number | null
  totalEstimatedCost?: number | null
  onEditBudget: () => void
}

type SummaryCard = {
  icon: SvgIconComponent
  label: string
  value: string
  tone?: 'success' | 'error' | 'primary'
  hint?: string
  onClick?: () => void
}

const toneColors = {
  primary: 'primary.main',
  success: 'success.main',
  error: 'error.main',
}

export const BudgetSummaryCards = ({
  canManageBudget,
  initialBudget,
  remainingBudget,
  totalActualCost,
  totalEstimatedCost,
  onEditBudget,
}: BudgetSummaryCardsProps) => {
  const remaining = remainingBudget ?? 0
  const cards: SummaryCard[] = [
    {
      icon: AccountBalanceWalletOutlinedIcon,
      label: 'TOTAL BUDGET',
      value: formatBudgetCurrency(initialBudget),
      hint: canManageBudget ? 'Click to edit' : undefined,
      onClick: canManageBudget ? onEditBudget : undefined,
      tone: 'primary',
    },
    {
      icon: SavingsOutlinedIcon,
      label: 'TOTAL ESTIMATED COST',
      value: formatBudgetCurrency(totalEstimatedCost),
    },
    {
      icon: AttachMoneyOutlinedIcon,
      label: 'TOTAL ACTUAL COST',
      value: formatBudgetCurrency(totalActualCost),
    },
    {
      icon: TrendingUpOutlinedIcon,
      label: 'REMAINING BUDGET',
      value: formatBudgetCurrency(Math.abs(remaining)),
      tone: remaining < 0 ? 'error' : remaining > 0 ? 'success' : 'primary',
    },
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
      }}
    >
      {cards.map((card) => (
        <SummaryCardView key={card.label} card={card} />
      ))}
    </Box>
  )
}

const SummaryCardView = ({ card }: { card: SummaryCard }) => {
  const Icon = card.icon
  const content = (
    <Paper
      variant="outlined"
      sx={{
        height: '100%',
        p: 2,
        borderRadius: 2,
        bgcolor: card.onClick ? 'rgba(18, 132, 248, 0.04)' : 'background.paper',
        transition: 'border-color 160ms ease, background-color 160ms ease',
        '&:hover': card.onClick
          ? {
              borderColor: 'primary.light',
              bgcolor: 'rgba(18, 132, 248, 0.08)',
            }
          : undefined,
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: 'action.hover',
            color: card.tone ? toneColors[card.tone] : 'text.secondary',
            display: 'grid',
            flexShrink: 0,
            placeItems: 'center',
          }}
        >
          <Icon fontSize="small" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            color="text.secondary"
            sx={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4 }}
          >
            {card.label}
          </Typography>
          <Typography
            sx={{
              color: card.tone ? toneColors[card.tone] : 'text.primary',
              fontSize: 20,
              fontWeight: 800,
              lineHeight: 1.25,
              mt: 0.75,
              overflowWrap: 'anywhere',
            }}
          >
            {card.value}
          </Typography>
          {card.hint ? (
            <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.5 }}>
              {card.hint}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </Paper>
  )

  if (!card.onClick) {
    return content
  }

  return (
    <ButtonBase
      onClick={card.onClick}
      sx={{
        borderRadius: 2,
        display: 'block',
        height: '100%',
        textAlign: 'left',
      }}
    >
      {content}
    </ButtonBase>
  )
}
