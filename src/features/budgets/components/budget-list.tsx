import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { CreditCard, Pencil, ReceiptText, Trash2 } from 'lucide-react'
import { tripPlannerColors } from '@/app/theme'
import { PaymentStatus, type BudgetResponse } from '@/shared'
import {
  ActionCluster,
  Button,
  CategoryIcon,
  StatusBadge,
} from '@/shared/components/ui'
import {
  getBudgetCategoryLabel,
  getPaymentStatusLabel,
} from '@/shared/lib/domain'
import { formatCurrency } from '@/shared/lib/display'

type BudgetListProps = {
  canManage?: boolean
  items: BudgetResponse[]
  onDelete: (item: BudgetResponse) => void
  onEdit: (item: BudgetResponse) => void
  onTogglePayment: (item: BudgetResponse) => void
}

export const BudgetList = ({
  canManage = true,
  items,
  onDelete,
  onEdit,
  onTogglePayment,
}: BudgetListProps) => {
  const theme = useTheme()
  const isTableLayout = useMediaQuery(theme.breakpoints.up('md'))

  if (isTableLayout) {
    return (
      <TableContainer
        className="item-table"
        component={Paper}
        variant="outlined"
        sx={{ borderColor: tripPlannerColors.border }}
      >
        <Table aria-label="Budget items">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Estimated</TableCell>
              <TableCell align="right">Actual</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Payment</TableCell>
              {canManage ? <TableCell align="right">Actions</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow className="item-row" data-testid="item-row" key={item.id}>
                <TableCell>
                  <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                    <CategoryIcon
                      icon={<ReceiptText size={17} />}
                      label={getBudgetCategoryLabel(item.category)}
                      tone={item.paymentStatus === PaymentStatus.PAID ? 'success' : 'warning'}
                    />
                    <Typography component="h2" variant="h3">
                      {item.itemName}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(item.estimatedCost)}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(item.actualCost)}
                </TableCell>
                <TableCell>
                  <StatusBadge tone="info">{getBudgetCategoryLabel(item.category)}</StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    tone={
                      item.paymentStatus === PaymentStatus.PAID
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {getPaymentStatusLabel(item.paymentStatus)}
                  </StatusBadge>
                </TableCell>
                {canManage ? (
                  <TableCell align="right">
                    <ActionCluster>
                      <Button type="button" onClick={() => onTogglePayment(item)}>
                        <CreditCard size={15} />
                        {item.paymentStatus === PaymentStatus.PAID
                          ? 'Mark unpaid'
                          : 'Mark paid'}
                      </Button>
                      <Button type="button" onClick={() => onEdit(item)}>
                        <Pencil size={15} />
                        Edit
                      </Button>
                      {item.id ? (
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => onDelete(item)}
                        >
                          <Trash2 size={15} />
                          Delete
                        </Button>
                      ) : null}
                    </ActionCluster>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <Stack className="item-list" spacing={1.5}>
      {items.map((item) => (
        <Paper
          className="item-row"
          component="article"
          data-testid="item-row"
          key={item.id}
          variant="outlined"
          sx={{
            display: 'grid',
            alignItems: 'center',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
            p: 2.25,
            borderColor: tripPlannerColors.border,
          }}
        >
          <Stack className="item-row__main" direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
            <CategoryIcon
              icon={<ReceiptText size={18} />}
              label={getBudgetCategoryLabel(item.category)}
              tone={item.paymentStatus === PaymentStatus.PAID ? 'success' : 'warning'}
              size="lg"
            />
            <Box sx={{ display: 'grid', gap: 0.75, minWidth: 0 }}>
              <Typography component="h2" variant="h2">
                {item.itemName}
              </Typography>
              <Typography color="text.secondary">
                {formatCurrency(item.actualCost)} actual from{' '}
                {formatCurrency(item.estimatedCost)} estimated
              </Typography>
              <Stack className="item-row__meta" direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <StatusBadge tone="info">{getBudgetCategoryLabel(item.category)}</StatusBadge>
                <StatusBadge
                  tone={
                    item.paymentStatus === PaymentStatus.PAID
                      ? 'success'
                      : 'warning'
                  }
                >
                  {getPaymentStatusLabel(item.paymentStatus)}
                </StatusBadge>
              </Stack>
            </Box>
          </Stack>
          {canManage ? (
            <Stack
              className="item-row__actions"
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexWrap: 'wrap' }}
            >
              <Button type="button" onClick={() => onTogglePayment(item)}>
                <CreditCard size={15} />
                {item.paymentStatus === PaymentStatus.PAID
                  ? 'Mark unpaid'
                  : 'Mark paid'}
              </Button>
              <Button type="button" onClick={() => onEdit(item)}>
                <Pencil size={15} />
                Edit
              </Button>
              {item.id ? (
                <Button type="button" variant="danger" onClick={() => onDelete(item)}>
                  <Trash2 size={15} />
                  Delete
                </Button>
              ) : null}
            </Stack>
          ) : null}
        </Paper>
      ))}
    </Stack>
  )
}
