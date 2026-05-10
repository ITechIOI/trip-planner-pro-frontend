import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  ErrorState,
  PageHeader,
  PaginationControls,
  Skeleton,
} from '@/shared/components/ui'
import { compactParams } from '@/shared/lib/display'
import { DEFAULT_PAGE_LIMIT, getPageOffset } from '@/shared/lib/pagination'

export const BudgetPage = () => {
  const tripId = useRequiredTripId()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetResponse | undefined>()
  const createItem = useCreateBudgetAction({
    mutation: { onSuccess: () => closeDialog() },
  })
  const updateItem = useUpdateBudgetAction()
  const deleteItem = useDeleteBudgetAction()
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
  const budgetQuery = useQueryTripBudgets(tripId ?? 0, filters)
  const summaryQuery = useTripBudgetSummary(tripId ?? 0)
  const budgetPage = budgetQuery.data as BudgetPageResponse | undefined
  const items = (budgetPage?.items ?? []) as BudgetResponse[]
  const summary = summaryQuery.data as BudgetSummaryResponse | undefined

  function closeDialog() {
    setIsDialogOpen(false)
    setEditingItem(undefined)
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

  const submitItem = (values: BudgetFormValues) => {
    if (!tripId) {
      return
    }

    const data = toBudgetRequestData(values)

    if (editingItem?.id) {
      updateItem.mutate(
        { tripId, budgetId: editingItem.id, data },
        { onSuccess: closeDialog },
      )
      return
    }

    createItem.mutate({ tripId, data })
  }

  const togglePayment = (item: BudgetResponse) => {
    if (!tripId || !item.id || !item.itemName) {
      return
    }

    const nextStatus =
      item.paymentStatus === PaymentStatus.PAID
        ? PaymentStatus.UNPAID
        : PaymentStatus.PAID

    updateItem.mutate({
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
    })
  }

  const deleteBudgetItem = (item: BudgetResponse) => {
    if (!tripId || !item.id) {
      return
    }

    deleteItem.mutate({ tripId, budgetId: item.id })
  }

  return (
    <section className="page-stack">
      <PageHeader
        title="Budget"
        description="Compare estimated and actual costs, monitor category totals, and keep payment status clear."
        action={
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus size={16} />
            Add cost
          </Button>
        }
      />

      <BudgetSummary summary={summary} />

      <BudgetFilters searchParams={searchParams} onFilterChange={updateFilter} />

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
          action={
            <Button
              type="button"
              variant="primary"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus size={16} />
              Add cost
            </Button>
          }
        />
      ) : null}

      <BudgetList
        items={items}
        onDelete={deleteBudgetItem}
        onEdit={(item) => {
          setEditingItem(item)
          setIsDialogOpen(true)
        }}
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
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingItem ? 'Edit budget item' : 'Add budget item'}
        description="Track estimated cost, actual cost, category, and payment status."
      >
        {tripId ? (
          <BudgetForm
            item={editingItem}
            isPending={createItem.isPending || updateItem.isPending}
            hasSubmitError={Boolean(createItem.error ?? updateItem.error)}
            onClose={closeDialog}
            onSubmit={submitItem}
          />
        ) : null}
      </AppDialog>
    </section>
  )
}
