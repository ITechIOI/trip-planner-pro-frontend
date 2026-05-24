import { useMemo } from 'react';
import type { BudgetCategory, CategoryTotals } from '../types/budget.types';
import { CATEGORIES, CATEGORY_COLORS } from '../helpers/budget.constants';
import { formatVND } from '../helpers/budget.calculations';

interface CategoryDonutChartProps {
  byCategory: Record<BudgetCategory, CategoryTotals>;
}

interface DonutSegment {
  name: BudgetCategory;
  value: number;
  estimated: number;
  path: string;
  color: string;
}

const PIE_SIZE = 140;
const PIE_CX = 70;
const PIE_CY = 70;
const OUTER_R = 55;
const INNER_R = 35;

function buildDonutPaths(
  data: Array<{ name: BudgetCategory; value: number; estimated: number }>
): DonutSegment[] {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return [];

  let startAngle = -Math.PI / 2;
  return data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;

    const x1 = PIE_CX + OUTER_R * Math.cos(startAngle);
    const y1 = PIE_CY + OUTER_R * Math.sin(startAngle);
    const x2 = PIE_CX + OUTER_R * Math.cos(endAngle);
    const y2 = PIE_CY + OUTER_R * Math.sin(endAngle);

    const ix1 = PIE_CX + INNER_R * Math.cos(startAngle);
    const iy1 = PIE_CY + INNER_R * Math.sin(startAngle);
    const ix2 = PIE_CX + INNER_R * Math.cos(endAngle);
    const iy2 = PIE_CY + INNER_R * Math.sin(endAngle);

    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M${x1},${y1} A${OUTER_R},${OUTER_R} 0 ${largeArc},1 ${x2},${y2} L${ix2},${iy2} A${INNER_R},${INNER_R} 0 ${largeArc},0 ${ix1},${iy1} Z`;

    startAngle = endAngle;
    return { ...d, path, color: CATEGORY_COLORS[d.name] };
  });
}

export function CategoryDonutChart({ byCategory }: CategoryDonutChartProps) {
  const activeData = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      name: cat,
      value: byCategory[cat].actual,
      estimated: byCategory[cat].estimated,
    })).filter((d) => d.value > 0 || d.estimated > 0);
  }, [byCategory]);

  const segments = useMemo(
    () => buildDonutPaths(activeData.filter((d) => d.value > 0)),
    [activeData]
  );

  if (activeData.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
        No expense data yet. Add expenses to see category totals.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      {/* Donut SVG */}
      <svg
        width={PIE_SIZE}
        height={PIE_SIZE}
        aria-label="Category spending donut chart"
        role="img"
        className="shrink-0"
      >
        {/* Background circle */}
        <circle
          cx={PIE_CX}
          cy={PIE_CY}
          r={OUTER_R}
          fill="#E5E7EB"
          className="dark:fill-gray-700"
          opacity={0.4}
        />
        {/* Segments */}
        {segments.map((seg) => (
          <path
            key={seg.name}
            d={seg.path}
            fill={seg.color}
            opacity={0.9}
          />
        ))}
        {/* Inner hole */}
        <circle
          cx={PIE_CX}
          cy={PIE_CY}
          r={INNER_R}
          className="fill-white dark:fill-gray-900"
        />
      </svg>

      {/* Legend */}
      <div className="min-w-[200px] flex-1">
        {activeData.map((d, i) => (
          <div
            key={d.name}
            className={[
              'flex items-center justify-between py-2',
              i < activeData.length - 1
                ? 'border-b border-gray-100 dark:border-gray-800'
                : '',
            ].join(' ')}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[d.name] }}
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {d.name.charAt(0) + d.name.slice(1).toLowerCase()}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formatVND(d.estimated)} VND estimated
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatVND(d.value)} VND
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
