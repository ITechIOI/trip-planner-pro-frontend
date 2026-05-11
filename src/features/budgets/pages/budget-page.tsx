import { Box } from '@mui/material'
import { keepPreviousData } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import emptyTravelUrl from '@/assets/generated/empty-travel.svg'
import { useRequiredTripId } from '@/app/route-helpers'
import { BudgetFilters } from '@/features/budgets/components/budget-filters'
import { BudgetForm } from '@/features/budgets/components/budget-form'
import { BudgetList } from '@/features/budgets/components/budget-list'
import { BudgetSummary } from '@/features/budgets/components/budget-summary'
import {
  useCreateBudgetAction,
  useDeleteBudgetAction,
  useQueryTripBudgets,
  useTripBudgetSummary,
  useUpdateBudgetAction,
} from '@/features/budgets'
import {
  getCreateBudgetErrorMessage,
  getDeleteBudgetErrorMessage,
  getToggleBudgetPaymentErrorMessage,
  getUpdateBudgetErrorMessage,
} from '@/features/budgets/lib/budgets-error'
import {
  type BudgetFormValues,
  toBudgetRequestData,
} from '@/features/budgets/lib/budget-schema'
import {
  PaymentStatus,
  type BudgetPageResponse,
  type BudgetResponse,
  type BudgetSummaryResponse,
  type QueryTripBudgetsParams,
} from '@/shared'
import {
  AppDialog,
  Button,
  EmptyState,
  EmptyIllustration,
  ErrorState,
  PageHeader,
  PaginationControls,
  Skeleton,
} from '@/shared/components/ui'
import { compactParams } from '@/shared/lib/display'
import { DEFAULT_PAGE_LIMIT, getPageOffset } from '@/shared/lib/pagination'
import { showErrorToast, showSuccessToast } from '@/shared/components/toast-store'
import { useDebouncedSearchParam } from '@/shared/lib/use-debounced-search-param'
import { useTripAccess } from '@/features/trips'

export const BudgetPage = () => {
  const tripId = useRequiredTripId()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = useDebouncedSearchParam({ searchParams, setSearchParams })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetResponse | undefined>()
  const createItem = useCreateBudgetAction()
  const updateItem = useUpdateBudgetAction()
  const deleteItem = useDeleteBudgetAction()
  const tripAccess = useTripAccess(tripId)
  const canManageResources = tripAccess.canManageResources
  const filters = useMemo(
    () =>
      compactParams({
        search: searchParams.get('search') ?? '',
        category: searchParams.get('category') ?? '',
        paymentStatus: searchParams.get('paymentStatus') ?? '',
        offset: getPageOffset(searchParams.get('offset')),
        limit: DEFAULT_PAGE_LIMIT,
      }) as QueryTripBudgetsParams,
    [searchParams],
  )
  const budgetQuery = useQueryTripBudgets(tripId ?? 0, filters, {
    query: { placeholderData: keepPreviousData },
  })
  const summaryQuery = useTripBudgetSummary(tripId ?? 0)
  const budgetPage = budgetQuery.data as BudgetPageResponse | undefined
  const items = (budgetPage?.items ?? []) as BudgetResponse[]
  const summary = summaryQuery.data as BudgetSummaryResponse | undefined

  function closeDialog() {
    setIsDialogOpen(false)
    setEditingItem(undefined)
  }

  const showReadOnlyToast = () => {
    showErrorToast('You can view this trip, but your role cannot make changes.')
  }

  const openCreateDialog = () => {
    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    setIsDialogOpen(true)
  }

  const openEditDialog = (item: BudgetResponse) => {
    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)

    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }

    next.delete('offset')
    setSearchParams(next)
  }

  const updateOffset = (offset: number) => {
    const next = new URLSearchParams(searchParams)

    if (offset > 0) {
      next.set('offset', String(offset))
    } else {
      next.delete('offset')
    }

    setSearchParams(next)
  }

  const resetFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  const submitItem = (values: BudgetFormValues) => {
    if (!tripId) {
      return
    }

    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    const data = toBudgetRequestData(values)

    if (editingItem?.id) {
      updateItem.mutate(
        { tripId, budgetId: editingItem.id, data },
        {
          onError: (error) => showErrorToast(getUpdateBudgetErrorMessage(error)),
          onSuccess: () => {
            closeDialog()
            showSuccessToast('Budget item saved.')
          },
        },
      )
      return
    }

    createItem.mutate(
      { tripId, data },
      {
        onError: (error) => showErrorToast(getCreateBudgetErrorMessage(error)),
        onSuccess: () => {
          closeDialog()
          showSuccessToast('Budget item added.')
        },
      },
    )
  }

  const togglePayment = (item: BudgetResponse) => {
    if (!tripId || !item.id || !item.itemName) {
      return
    }

    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    const nextStatus =
      item.paymentStatus === PaymentStatus.PAID
        ? PaymentStatus.UNPAID
        : PaymentStatus.PAID

    updateItem.mutate(
      {
        tripId,
        budgetId: item.id,
        data: {
          itemName: item.itemName,
          category: item.category,
          estimatedCost: item.estimatedCost,
          actualCost:
            nextStatus === PaymentStatus.PAID
              ? (item.actualCost ?? item.estimatedCost ?? 0)
              : item.actualCost,
          paymentStatus: nextStatus,
        },
      },
      {
        onError: (error) => showErrorToast(getToggleBudgetPaymentErrorMessage(error)),
        onSuccess: () => showSuccessToast('Payment status updated.'),
      },
    )
  }

  const deleteBudgetItem = (item: BudgetResponse) => {
    if (!tripId || !item.id) {
      return
    }

    if (!canManageResources) {
      showReadOnlyToast()
      return
    }

    deleteItem.mutate(
      { tripId, budgetId: item.id },
      {
        onError: (error) => showErrorToast(getDeleteBudgetErrorMessage(error)),
        onSuccess: () => showSuccessToast('Budget item deleted.'),
      },
    )
  }

  return (
    <Box
      className="page-stack"
      component="section"
      sx={{ display: 'grid', gap: 2.75 }}
    >
      <PageHeader
        title="Budget"
        description="Compare estimated and actual costs, monitor category totals, and keep payment status clear."
        action={
          canManageResources ? (
            <Button type="button" variant="primary" onClick={openCreateDialog}>
              <Plus size={16} />
              Add cost
            </Button>
          ) : undefined
        }
      />

      <BudgetSummary summary={summary} />

      <BudgetFilters
        onSearchChange={search.onChange}
        searchParams={searchParams}
        searchValue={search.value}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      {budgetQuery.isLoading || summaryQuery.isLoading ? <Skeleton rows={5} /> : null}
      {budgetQuery.error || summaryQuery.error ? (
        <ErrorState
          description="Budget data could not be loaded."
          action={
            <Button
              onClick={() => {
                budgetQuery.refetch()
                summaryQuery.refetch()
              }}
            >
              Retry
            </Button>
          }
        />
      ) : null}
      {!budgetQuery.isLoading && !budgetQuery.error && items.length === 0 ? (
        <EmptyState
          title="No budget items yet"
          description="Add estimated and actual costs to track budget usage."
          illustration={<EmptyIllustration src={emptyTravelUrl} alt="" />}
          action={
            canManageResources ? (
              <Button type="button" variant="primary" onClick={openCreateDialog}>
                <Plus size={16} />
                Add cost
              </Button>
            ) : undefined
          }
        />
      ) : null}

      <BudgetList
        canManage={canManageResources}
        items={items}
        onDelete={deleteBudgetItem}
        onEdit={openEditDialog}
        onTogglePayment={togglePayment}
      />

      <PaginationControls
        offset={budgetPage?.offset}
        limit={budgetPage?.limit}
        total={budgetPage?.total}
        disabled={budgetQuery.isFetching}
        onOffsetChange={updateOffset}
      />

      <AppDialog
        open={canManageResources && isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingItem ? 'Edit budget item' : 'Add budget item'}
        description="Track estimated cost, actual cost, category, and payment status."
      >
        {tripId ? (
          <BudgetForm
            item={editingItem}
            isPending={createItem.isPending || updateItem.isPending}
            onClose={closeDialog}
            onSubmit={submitItem}
          />
        ) : null}
      </AppDialog>
    </Box>
  )
}
