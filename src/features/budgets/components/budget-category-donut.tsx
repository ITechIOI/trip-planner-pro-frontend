import { Box, Stack, Typography } from '@mui/material'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { tripPlannerColors } from '@/app/theme'
import type { BudgetSummaryResponse } from '@/shared'
import { getBudgetCategoryLabel } from '@/shared/lib/domain'
import { formatCurrency } from '@/shared/lib/display'

type BudgetCategorySummary = NonNullable<
  BudgetSummaryResponse['categorySummaries']
>[number]

type BudgetCategoryDonutProps = {
  categories?: BudgetCategorySummary[]
}

const categoryColors = [
  tripPlannerColors.primary,
  tripPlannerColors.secondary,
  tripPlannerColors.cta,
  tripPlannerColors.warning,
  '#6366F1',
  '#14B8A6',
]

export const BudgetCategoryDonut = ({
  categories = [],
}: BudgetCategoryDonutProps) => {
  const data = categories
    .map((category, index) => ({
      category: category.category,
      color: categoryColors[index % categoryColors.length],
      estimated: category.totalEstimatedCost ?? 0,
      name: getBudgetCategoryLabel(category.category),
      value: Math.max(0, category.totalActualCost ?? 0),
    }))
    .filter((category) => category.value > 0)

  if (data.length === 0) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          bgcolor: tripPlannerColors.surfaceSoft,
          border: `1px dashed ${tripPlannerColors.border}`,
          borderRadius: 2,
          color: 'text.secondary',
          display: 'grid',
          minHeight: 220,
          placeItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography sx={{ fontWeight: 750 }}>No actual spend yet</Typography>
      </Box>
    )
  }

  return (
    <Box
      className="budget-category-donut"
      data-testid="budget-category-donut"
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', lg: '260px 1fr' },
        alignItems: 'center',
      }}
    >
      <Box sx={{ height: 240, minWidth: 0 }}>
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="58%"
              isAnimationActive={false}
              outerRadius="86%"
              paddingAngle={3}
              stroke="#FFFFFF"
              strokeWidth={3}
            >
              {data.map((entry) => (
                <Cell fill={entry.color} key={entry.category} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              separator=": "
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Stack className="category-list" spacing={1}>
        {data.map((category) => (
          <Box
            className="category-row"
            key={category.category}
            sx={{
              alignItems: 'center',
              borderBottom: `1px solid ${tripPlannerColors.border}`,
              display: 'grid',
              gap: 1.25,
              gridTemplateColumns: 'auto minmax(0, 1fr) auto',
              py: 1,
              '&:last-child': { borderBottom: 0 },
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                bgcolor: category.color,
                borderRadius: 999,
                height: 10,
                width: 10,
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography component="span" sx={{ fontWeight: 800 }}>
                {category.name}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 12.5 }}>
                {formatCurrency(category.estimated)} estimated
              </Typography>
            </Box>
            <Typography component="strong" sx={{ fontWeight: 900 }}>
              {formatCurrency(category.value)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
