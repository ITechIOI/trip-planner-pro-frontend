import { AlertTriangle } from 'lucide-react'
import type { BudgetSummaryResponse } from '@/shared'
import {
  ProgressBar,
  StatCard,
} from '@/shared/components/ui'
import {
  getBudgetCategoryLabel,
  getWarningTone,
} from '@/shared/lib/domain'
import { formatCurrency, formatPercent } from '@/shared/lib/display'

type BudgetSummaryProps = {
  summary?: BudgetSummaryResponse
}

type StatTone = 'neutral' | 'info' | 'success' | 'warning' | 'critical'

export const BudgetSummary = ({ summary }: BudgetSummaryProps) => {
  const warningTone = getWarningTone(summary?.warningLevel)

  return (
    <>
      <div className="metrics-grid">
        <StatCard
          label="Initial budget"
          value={formatCurrency(summary?.initialBudget)}
          detail="Trip budget"
          tone="neutral"
        />
        <StatCard
          label="Actual spend"
          value={formatCurrency(summary?.totalActualCost)}
          detail="Paid or recorded actuals"
          tone={warningTone}
        />
        <StatCard
          label="Estimated total"
          value={formatCurrency(summary?.totalEstimatedCost)}
          detail="Planned costs"
          tone="info"
        />
        <StatCard
          label="Actual vs estimated"
          value={formatCurrency(summary?.actualMinusEstimatedCost)}
          detail="Positive means over estimate"
          tone={getActualMinusEstimatedTone(summary)}
        />
        <StatCard
          label="Remaining"
          value={formatCurrency(summary?.remainingBudget)}
          detail="Budget left"
          tone={getRemainingTone(summary)}
        />
        <StatCard
          label="Budget used"
          value={formatPercent(summary?.budgetUsagePercent)}
          detail={summary?.warningLevel ?? 'SAFE'}
          tone={warningTone}
        />
      </div>

      {summary?.warningLevel ? (
        <article className={`warning-banner warning-banner--${warningTone}`}>
          <AlertTriangle size={18} />
          <div>
            <strong>{summary.warningLevel}</strong>
            <p>
              Budget usage is {formatPercent(summary.budgetUsagePercent)} of the
              initial budget.
            </p>
          </div>
        </article>
      ) : null}

      <article className="panel">
        <div className="panel__header">
          <div>
            <h2>Budget usage</h2>
            <p>80% shows WARNING and 100% shows CRITICAL.</p>
          </div>
        </div>
        <ProgressBar value={summary?.budgetUsagePercent} tone={warningTone} />
      </article>

      {summary?.categorySummaries?.length ? (
        <article className="panel">
          <div className="panel__header">
            <div>
              <h2>Category totals</h2>
              <p>Estimated and actual spend by budget category.</p>
            </div>
          </div>
          <div className="category-list">
            {summary.categorySummaries.map((category) => (
              <div className="category-row" key={category.category}>
                <span>{getBudgetCategoryLabel(category.category)}</span>
                <strong>{formatCurrency(category.totalActualCost)}</strong>
                <small>{formatCurrency(category.totalEstimatedCost)} estimated</small>
              </div>
            ))}
          </div>
        </article>
      ) : null}
    </>
  )
}

const getActualMinusEstimatedTone = (
  summary?: BudgetSummaryResponse,
): StatTone => {
  if (
    summary?.actualMinusEstimatedCost != null &&
    summary.actualMinusEstimatedCost > 0
  ) {
    return 'warning'
  }

  return 'success'
}

const getRemainingTone = (summary?: BudgetSummaryResponse): StatTone => {
  if (summary?.remainingBudget != null && summary.remainingBudget < 0) {
    return 'critical'
  }

  return 'success'
}
