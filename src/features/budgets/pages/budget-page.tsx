import AddIcon from '@mui/icons-material/Add'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import SearchIcon from '@mui/icons-material/Search'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { keepPreviousData, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { AppLayout } from '@/shared/components/app-layout'
import { ConfirmActionDialog } from '@/shared/components/confirm-action-dialog'
import { EmptyState } from '@/shared/components/empty-state'
import { TablePaginationToolbar } from '@/shared/components/table-pagination-toolbar'
import { invalidateFeatureQueries, useDebouncedValue } from '@/shared/lib'
import {
  useTripAccess,
  useTripDashboard,
  useUpdateTripAction,
} from '@/features/trips/api'
import { getTripsErrorMessage } from '@/features/trips/lib/trips-error'
import type {
  BudgetPageResponse,
  BudgetSummaryResponse,
  CreateBudgetMutationError,
  DeleteBudgetMutationError,
  GetTripBudgetSummaryQueryError,
  QueryTripBudgetsParams,
  QueryTripBudgetsQueryError,
  TripDashboardResponse,
  UpdateBudgetMutationError,
  UpdateTripMutationError,
} from '@/shared'
import {
  useCreateBudgetAction,
  useDeleteBudgetAction,
  useQueryTripBudgets,
  useTripBudgetSummary,
  useUpdateBudgetAction,
} from '../api'
import {
  BudgetAlertBanner,
  BudgetFilters,
  BudgetItemCard,
  BudgetItemFormDialog,
  BudgetProgress,
  BudgetSummaryCards,
  CategoryTotalsPanel,
  EditTotalBudgetDialog,
  UnpaidRing,
} from '../components'
import {
  DEFAULT_BUDGET_PAGE_LIMIT,
  buildBudgetCategoryTotals,
  buildBudgetItemPayload,
  buildUpdateBudgetItemPayload,
  budgetsQueryKeys,
  getBudgetItemCount,
  getBudgetsErrorMessage,
  toBudgetItemView,
  type BudgetCategoryFilterValue,
  type BudgetItemFormValues,
  type BudgetItemView,
  type BudgetStatusFilterValue,
} from '../lib'

export type BudgetPageProps = {
  tripId: number
}

type ItemFormMode = 'create' | 'edit' | null

type PendingBudgetAction =
  | {
      type: 'update-item'
      item: BudgetItemView
      values: BudgetItemFormValues
    }
  | {
      type: 'delete-item'
      item: BudgetItemView
    }
  | {
      type: 'update-total-budget'
      value: number
    }

const BudgetLoadingState = () => (
  <Stack spacing={2}>
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
      {Array.from({ length: 4 }).map((_, index) => (
        <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="80%" height={40} />
        </Paper>
      ))}
    </Box>
    <Skeleton variant="rounded" height={94} />
    <Skeleton variant="rounded" height={72} />
    <Skeleton variant="rounded" height={260} />
  </Stack>
)

const BudgetContent = ({ tripId }: BudgetPageProps) => {
  const queryClient = useQueryClient()
  const [itemFormMode, setItemFormMode] = useState<ItemFormMode>(null)
  const [editingItem, setEditingItem] = useState<BudgetItemView | null>(null)
  const [isTotalBudgetDialogOpen, setIsTotalBudgetDialogOpen] =
    useState(false)
  const [pendingAction, setPendingAction] =
    useState<PendingBudgetAction | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] =
    useState<BudgetCategoryFilterValue>('')
  const [statusFilter, setStatusFilter] = useState<BudgetStatusFilterValue>('')
  const [offset, setOffset] = useState(0)
  const debouncedSearch = useDebouncedValue(search)
  const normalizedSearch = debouncedSearch.trim()

  const tripAccess = useTripAccess(tripId)
  const canManageBudget = tripAccess.canEditTrip
  const listParams = useMemo<QueryTripBudgetsParams>(
    () => ({
      offset,
      limit: DEFAULT_BUDGET_PAGE_LIMIT,
      ...(categoryFilter ? { category: categoryFilter } : {}),
      ...(statusFilter ? { paymentStatus: statusFilter } : {}),
      ...(normalizedSearch ? { search: normalizedSearch } : {}),
    }),
    [categoryFilter, normalizedSearch, offset, statusFilter],
  )

  const budgetsQuery = useQueryTripBudgets(tripId, listParams, {
    query: {
      placeholderData: keepPreviousData,
    },
  })
  const summaryQuery = useTripBudgetSummary(tripId)
  const dashboardQuery = useTripDashboard(tripId)
  const createBudgetMutation = useCreateBudgetAction()
  const updateBudgetMutation = useUpdateBudgetAction()
  const deleteBudgetMutation = useDeleteBudgetAction()
  const updateTripMutation = useUpdateTripAction({
    mutation: {
      onSuccess: async (_data, variables) => {
        await invalidateFeatureQueries(
          queryClient,
          budgetsQueryKeys.affectedTripBudgets(variables.tripId),
        )
      },
    },
  })

  const budgetsPage = budgetsQuery.data as BudgetPageResponse | undefined
  const budgetSummary = summaryQuery.data as BudgetSummaryResponse | undefined
  const dashboard = dashboardQuery.data as TripDashboardResponse | undefined
  const budgetItems = useMemo(
    () =>
      (budgetsPage?.items ?? [])
        .map(toBudgetItemView)
        .filter((item): item is BudgetItemView => item != null),
    [budgetsPage?.items],
  )
  const byCategory = useMemo(
    () => buildBudgetCategoryTotals(budgetSummary),
    [budgetSummary],
  )
  const totalBudgetItemCount = getBudgetItemCount(byCategory)
  const unpaidBudgetItemCount = dashboard?.unpaidBudgetItemCount ?? 0
  const total = budgetsPage?.total ?? 0
  const limit = budgetsPage?.limit ?? DEFAULT_BUDGET_PAGE_LIMIT
  const currentOffset = budgetsPage?.offset ?? offset
  const pageCount = Math.max(1, Math.ceil(total / limit))
  const currentPage = Math.min(
    pageCount,
    Math.floor(currentOffset / limit) + 1,
  )
  const hasActiveFilters = Boolean(search || categoryFilter || statusFilter)
  const isInitialLoading =
    (budgetsQuery.isLoading && !budgetsQuery.data) ||
    (summaryQuery.isLoading && !summaryQuery.data)
  const listErrorMessage = budgetsQuery.error
    ? getBudgetsErrorMessage(
        budgetsQuery.error as QueryTripBudgetsQueryError,
      )
    : null
  const summaryErrorMessage = summaryQuery.error
    ? getBudgetsErrorMessage(
        summaryQuery.error as GetTripBudgetSummaryQueryError,
      )
    : null
  const accessErrorMessage = tripAccess.error
    ? 'Unable to resolve your trip access. Budget actions may be unavailable.'
    : null
  const errorMessage =
    listErrorMessage ?? summaryErrorMessage ?? accessErrorMessage

  const resetOffset = () => setOffset(0)

  const openCreateDialog = () => {
    createBudgetMutation.reset()
    setEditingItem(null)
    setItemFormMode('create')
  }

  const openEditDialog = (item: BudgetItemView) => {
    updateBudgetMutation.reset()
    setEditingItem(item)
    setItemFormMode('edit')
  }

  const closeItemDialog = () => {
    if (createBudgetMutation.isPending || updateBudgetMutation.isPending) {
      return
    }

    setItemFormMode(null)
    setEditingItem(null)
  }

  const openTotalBudgetDialog = () => {
    updateTripMutation.reset()
    setIsTotalBudgetDialogOpen(true)
  }

  const closeTotalBudgetDialog = () => {
    if (updateTripMutation.isPending) {
      return
    }

    setIsTotalBudgetDialogOpen(false)
  }

  const clearFilters = () => {
    setSearch('')
    setCategoryFilter('')
    setStatusFilter('')
    resetOffset()
  }

  const handleCreateBudget = (values: BudgetItemFormValues) => {
    createBudgetMutation.mutate(
      {
        tripId,
        data: buildBudgetItemPayload(values),
      },
      {
        onSuccess: () => {
          setItemFormMode(null)
          setEditingItem(null)
        },
      },
    )
  }

  const handleSaveItemChanges = (values: BudgetItemFormValues) => {
    if (!editingItem) {
      return
    }

    updateBudgetMutation.reset()
    setPendingAction({
      type: 'update-item',
      item: editingItem,
      values,
    })
  }

  const handleRequestDelete = (item: BudgetItemView) => {
    deleteBudgetMutation.reset()
    setPendingAction({ type: 'delete-item', item })
  }

  const handleSaveTotalBudget = (value: number) => {
    updateTripMutation.reset()
    setPendingAction({ type: 'update-total-budget', value })
  }

  const handleConfirmAction = () => {
    if (!pendingAction) {
      return
    }

    if (pendingAction.type === 'update-item') {
      updateBudgetMutation.mutate(
        {
          tripId,
          budgetId: pendingAction.item.id,
          data: buildUpdateBudgetItemPayload(pendingAction.values),
        },
        {
          onSuccess: () => {
            setPendingAction(null)
            setItemFormMode(null)
            setEditingItem(null)
          },
        },
      )
      return
    }

    if (pendingAction.type === 'delete-item') {
      deleteBudgetMutation.mutate(
        {
          tripId,
          budgetId: pendingAction.item.id,
        },
        {
          onSuccess: () => setPendingAction(null),
        },
      )
      return
    }

    updateTripMutation.mutate(
      {
        tripId,
        data: {
          estimatedBudget: pendingAction.value,
        },
      },
      {
        onSuccess: () => {
          setPendingAction(null)
          setIsTotalBudgetDialogOpen(false)
        },
      },
    )
  }

  const handleCancelConfirm = () => {
    if (
      updateBudgetMutation.isPending ||
      deleteBudgetMutation.isPending ||
      updateTripMutation.isPending
    ) {
      return
    }

    setPendingAction(null)
  }

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * limit)
  }

  const confirmDialog = buildConfirmDialogState({
    pendingAction,
    deleteErrorMessage: deleteBudgetMutation.error
      ? getBudgetsErrorMessage(
          deleteBudgetMutation.error as DeleteBudgetMutationError,
        )
      : null,
    updateErrorMessage: updateBudgetMutation.error
      ? getBudgetsErrorMessage(
          updateBudgetMutation.error as UpdateBudgetMutationError,
        )
      : null,
    updateTripErrorMessage: updateTripMutation.error
      ? getTripsErrorMessage(
          updateTripMutation.error as UpdateTripMutationError,
        )
      : null,
  })

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
      >
        <Box>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <AccountBalanceWalletOutlinedIcon
              color="primary"
              sx={{ fontSize: 36 }}
            />
            <Typography component="h1" variant="h5" sx={{ fontWeight: 800 }}>
              Budget
            </Typography>
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Track and manage your trip expenses
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { sm: 'center' } }}
        >
          <UnpaidRing
            totalCount={totalBudgetItemCount}
            unpaidCount={unpaidBudgetItemCount}
          />
          {canManageBudget ? (
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={openCreateDialog}
            >
              Add Expense
            </Button>
          ) : null}
        </Stack>
      </Stack>

      {errorMessage ? (
        <Alert
          action={
            listErrorMessage || summaryErrorMessage ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  void budgetsQuery.refetch()
                  void summaryQuery.refetch()
                }}
              >
                Retry
              </Button>
            ) : undefined
          }
          severity="error"
        >
          {errorMessage}
        </Alert>
      ) : null}

      {tripAccess.role === 'VIEW' ? (
        <Alert severity="info">
          You can view this budget, but only trip owners and editors can make
          changes.
        </Alert>
      ) : null}

      {isInitialLoading ? (
        <BudgetLoadingState />
      ) : (
        <>
          <BudgetAlertBanner
            usagePercent={budgetSummary?.budgetUsagePercent}
            warningLevel={budgetSummary?.warningLevel}
          />

          <BudgetSummaryCards
            canManageBudget={canManageBudget}
            initialBudget={budgetSummary?.initialBudget}
            remainingBudget={budgetSummary?.remainingBudget}
            totalActualCost={budgetSummary?.totalActualCost}
            totalEstimatedCost={budgetSummary?.totalEstimatedCost}
            onEditBudget={openTotalBudgetDialog}
          />

          <BudgetProgress
            byCategory={byCategory}
            initialBudget={budgetSummary?.initialBudget}
            totalActualCost={budgetSummary?.totalActualCost}
            usagePercent={budgetSummary?.budgetUsagePercent}
          />

          <CategoryTotalsPanel byCategory={byCategory} />

          <BudgetFilters
            categoryFilter={categoryFilter}
            search={search}
            statusFilter={statusFilter}
            onCategoryChange={(value) => {
              setCategoryFilter(value)
              resetOffset()
            }}
            onClearFilters={clearFilters}
            onSearchChange={(value) => {
              setSearch(value)
              resetOffset()
            }}
            onStatusChange={(value) => {
              setStatusFilter(value)
              resetOffset()
            }}
          />

          {budgetsQuery.isFetching && budgetsQuery.data ? (
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Refreshing budget items...
            </Typography>
          ) : null}

          {total === 0 ? (
            <EmptyState
              icon={hasActiveFilters ? SearchIcon : ErrorOutlineOutlinedIcon}
              title={
                hasActiveFilters ? 'No matching expenses' : 'No expenses yet'
              }
              description={
                hasActiveFilters
                  ? 'Try adjusting your search or filters.'
                  : 'Start tracking your trip costs by adding your first expense.'
              }
              action={
                hasActiveFilters
                  ? { label: 'Clear Filters', onClick: clearFilters }
                  : canManageBudget
                    ? { label: 'Add First Expense', onClick: openCreateDialog }
                    : undefined
              }
            />
          ) : (
            <Stack spacing={1.25}>
              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                Showing {budgetItems.length} of {total} expenses
              </Typography>
              {budgetItems.map((item) => (
                <BudgetItemCard
                  key={item.id}
                  canManageBudget={canManageBudget}
                  isActionPending={
                    updateBudgetMutation.isPending ||
                    deleteBudgetMutation.isPending
                  }
                  item={item}
                  onDelete={handleRequestDelete}
                  onEdit={openEditDialog}
                />
              ))}
              <TablePaginationToolbar
                currentOffset={currentOffset}
                currentPage={currentPage}
                isFetching={budgetsQuery.isFetching}
                limit={limit}
                pageCount={pageCount}
                total={total}
                onPageChange={handlePageChange}
              />
            </Stack>
          )}
        </>
      )}

      {itemFormMode != null ? (
        <BudgetItemFormDialog
          errorMessage={
            itemFormMode === 'create' && createBudgetMutation.error
              ? getBudgetsErrorMessage(
                  createBudgetMutation.error as CreateBudgetMutationError,
                )
              : itemFormMode === 'edit' && updateBudgetMutation.error
                ? getBudgetsErrorMessage(
                    updateBudgetMutation.error as UpdateBudgetMutationError,
                  )
                : null
          }
          initialItem={editingItem}
          isSubmitting={
            createBudgetMutation.isPending || updateBudgetMutation.isPending
          }
          mode={itemFormMode}
          open
          onClose={closeItemDialog}
          onSubmit={
            itemFormMode === 'edit'
              ? handleSaveItemChanges
              : handleCreateBudget
          }
        />
      ) : null}

      {isTotalBudgetDialogOpen ? (
        <EditTotalBudgetDialog
          currentBudget={budgetSummary?.initialBudget}
          errorMessage={
            updateTripMutation.error
              ? getTripsErrorMessage(
                  updateTripMutation.error as UpdateTripMutationError,
                )
              : null
          }
          isSubmitting={updateTripMutation.isPending}
          open
          onClose={closeTotalBudgetDialog}
          onSubmit={handleSaveTotalBudget}
        />
      ) : null}

      <ConfirmActionDialog
        confirmColor={confirmDialog.confirmColor}
        confirmLabel={confirmDialog.confirmLabel}
        description={confirmDialog.description}
        errorMessage={confirmDialog.errorMessage}
        isPending={
          updateBudgetMutation.isPending ||
          deleteBudgetMutation.isPending ||
          updateTripMutation.isPending
        }
        open={pendingAction != null}
        title={confirmDialog.title}
        onCancel={handleCancelConfirm}
        onConfirm={handleConfirmAction}
      />
    </Stack>
  )
}

const buildConfirmDialogState = ({
  pendingAction,
  deleteErrorMessage,
  updateErrorMessage,
  updateTripErrorMessage,
}: {
  pendingAction: PendingBudgetAction | null
  deleteErrorMessage?: string | null
  updateErrorMessage?: string | null
  updateTripErrorMessage?: string | null
}) => {
  if (pendingAction?.type === 'delete-item') {
    return {
      confirmColor: 'error' as const,
      confirmLabel: 'Delete',
      description: `Delete "${pendingAction.item.itemName}"? This action cannot be undone.`,
      errorMessage: deleteErrorMessage,
      title: 'Delete expense?',
    }
  }

  if (pendingAction?.type === 'update-total-budget') {
    return {
      confirmColor: 'primary' as const,
      confirmLabel: 'Save Changes',
      description:
        'Save this trip budget change? Dashboard and budget summary values will refresh after the update.',
      errorMessage: updateTripErrorMessage,
      title: 'Save budget changes?',
    }
  }

  if (pendingAction?.type === 'update-item') {
    return {
      confirmColor: 'primary' as const,
      confirmLabel: 'Save Changes',
      description: `Save changes to "${pendingAction.item.itemName}"?`,
      errorMessage: updateErrorMessage,
      title: 'Save expense changes?',
    }
  }

  return {
    confirmColor: 'primary' as const,
    confirmLabel: 'Confirm',
    description: '',
    errorMessage: null,
    title: 'Confirm action',
  }
}

export const BudgetPage = ({ tripId }: BudgetPageProps) => (
  <AppLayout tripId={tripId}>
    <BudgetContent tripId={tripId} />
  </AppLayout>
)

export default BudgetPage
