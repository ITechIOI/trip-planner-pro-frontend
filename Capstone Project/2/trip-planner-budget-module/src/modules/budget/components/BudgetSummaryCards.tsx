import { formatVND } from '../helpers/budget.calculations';

interface SummaryCard {
  label: string;
  value: string;
  status?: 'positive' | 'negative' | 'neutral';
  hint?: string;
  onClick?: () => void;
}

interface BudgetSummaryCardsProps {
  budget: number;
  totalEstimated: number;
  totalActual: number;
  remaining: number;
  onEditBudget: () => void;
}

export function BudgetSummaryCards({
  budget,
  totalEstimated,
  totalActual,
  remaining,
  onEditBudget,
}: BudgetSummaryCardsProps) {
  const cards: SummaryCard[] = [
    {
      label: 'TOTAL BUDGET',
      value: `${formatVND(budget)} VND`,
      onClick: onEditBudget,
      hint: 'Click to edit',
    },
    {
      label: 'TOTAL ESTIMATED COST',
      value: `${formatVND(totalEstimated)} VND`,
    },
    {
      label: 'TOTAL ACTUAL COST',
      value: `${formatVND(totalActual)} VND`,
    },
    {
      label: 'REMAINING BUDGET',
      value: `${remaining >= 0 ? '+ ' : ''}${formatVND(remaining)} VND`,
      status:
        remaining > 0
        ? 'positive'
        : remaining < 0
        ? 'negative'
        : 'neutral',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          onClick={card.onClick}
          className={[
            'rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50',
            card.onClick
              ? 'cursor-pointer transition hover:border-blue-200 hover:bg-blue-50/40 dark:hover:border-blue-800 dark:hover:bg-blue-900/20'
              : '',
          ].join(' ')}
        >
          <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-gray-400 dark:text-gray-500">
            {card.label}
          </p>
          <p
            className={[
              'text-lg font-medium leading-tight',
              card.status === 'positive'
                ? 'text-emerald-600 dark:text-emerald-400'
                : card.status === 'negative'
                ? 'text-red-500 dark:text-red-400'
                : 'text-gray-900 dark:text-gray-100'
            ].join(' ')}
          >
            {card.value}
          </p>
          {card.hint && (
            <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
              {card.hint}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
