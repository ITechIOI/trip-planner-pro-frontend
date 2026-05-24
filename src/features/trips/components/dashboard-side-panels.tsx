import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import {
  buildTripBudgetPath,
  buildTripPackingPath,
} from "@/app/router/routePaths";
import type {
  BudgetCategorySummaryResponse,
  BudgetSummaryResponse,
  TripDashboardResponse,
} from "@/shared";
import {
  clampDashboardPercent,
  formatDashboardCurrency,
  formatDashboardPercent,
  getBudgetWarningLabel,
  getBudgetWarningTone,
} from "../lib/dashboard-fields";

export type DashboardSidePanelsProps = {
  budgetSummary?: BudgetSummaryResponse;
  dashboard: TripDashboardResponse;
  isBudgetSummaryLoading?: boolean;
  tripId: number;
};

const categoryColors: Record<string, string> = {
  TRANSPORT: "#14b8a6",
  ACCOMMODATION: "#3b82f6",
  FOOD: "#f59e0b",
  SHOPPING: "#ec4899",
  ACTIVITY: "#6366f1",
  OTHER: "#94a3b8",
};

type BudgetBreakdownRowProps = {
  label: string;
  value: string;
  percent: number;
  progress: number;
  color: string;
};

const BudgetBreakdownRow = ({
  label,
  value,
  percent,
  progress,
  color,
}: BudgetBreakdownRowProps) => (
  <Box sx={{ display: "grid", gap: 0.5 }}>
    <Stack
      direction="row"
      sx={{ alignItems: "baseline", justifyContent: "space-between", gap: 1 }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
        {Math.round(percent)}%
      </Typography>
    </Stack>
    <Box
      sx={{
        height: 5,
        overflow: "hidden",
        borderRadius: 999,
        bgcolor: "action.hover",
      }}
    >
      <Box
        sx={{
          width: `${clampDashboardPercent(progress)}%`,
          height: "100%",
          borderRadius: 999,
          bgcolor: color,
        }}
      />
    </Box>
    <Typography
      color="text.secondary"
      sx={{ fontSize: 12, textAlign: "right" }}
    >
      {value}
    </Typography>
  </Box>
);

type CategoryBudgetSlice = {
  amount: number;
  color: string;
  label: string;
  percent: number;
};

const getBudgetCategoryLabel = (category?: string | null) => {
  switch (category) {
    case "TRANSPORT":
      return "Transport";
    case "ACCOMMODATION":
      return "Accommodation";
    case "FOOD":
      return "Food";
    case "SHOPPING":
      return "Shopping";
    case "ACTIVITY":
      return "Activity";
    case "OTHER":
    default:
      return "Others";
  }
};

const buildCategoryBudgetSlices = (
  categorySummaries?: BudgetCategorySummaryResponse[],
): CategoryBudgetSlice[] => {
  const summaries = categorySummaries ?? [];
  const shouldUseActual = summaries.some(
    (summary) => (summary.totalActualCost ?? 0) > 0,
  );
  const total = summaries.reduce((sum, summary) => {
    const amount = shouldUseActual
      ? (summary.totalActualCost ?? 0)
      : (summary.totalEstimatedCost ?? 0);

    return sum + Math.max(amount, 0);
  }, 0);

  if (total <= 0) {
    return [];
  }

  return summaries
    .map((summary) => {
      const amount = Math.max(
        shouldUseActual
          ? (summary.totalActualCost ?? 0)
          : (summary.totalEstimatedCost ?? 0),
        0,
      );
      const category = summary.category ?? "OTHER";

      return {
        amount,
        color: categoryColors[category] ?? categoryColors.OTHER,
        label: getBudgetCategoryLabel(category),
        percent: (amount / total) * 100,
      };
    })
    .filter((slice) => slice.amount > 0);
};

type BudgetCategoryDistributionChartProps = {
  categorySummaries?: BudgetCategorySummaryResponse[];
  isLoading?: boolean;
};

const BudgetCategoryDistributionChart = ({
  categorySummaries,
  isLoading = false,
}: BudgetCategoryDistributionChartProps) => {
  const slices = buildCategoryBudgetSlices(categorySummaries);
  const total = slices.reduce((sum, slice) => sum + slice.amount, 0);
  const circumference = 2 * Math.PI * 68;
  const chartSegments = slices.reduce<{
    items: {
      offset: number;
      segmentLength: number;
      slice: CategoryBudgetSlice;
    }[];
    offset: number;
  }>(
    (accumulator, slice) => {
      const segmentLength = (slice.percent / 100) * circumference;

      return {
        items: [
          ...accumulator.items,
          { offset: accumulator.offset, segmentLength, slice },
        ],
        offset: accumulator.offset + segmentLength,
      };
    },
    { items: [], offset: 0 },
  ).items;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 216px",
          gap: 1.75,
          alignItems: "center",
        }}
      >
        <Stack spacing={1.25}>
          <Skeleton variant="rounded" height={34} />
          <Skeleton variant="rounded" height={34} />
          <Skeleton variant="rounded" height={34} />
        </Stack>
        <Skeleton variant="circular" width={216} height={216} />
      </Box>
    );
  }

  if (slices.length === 0) {
    return (
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          minHeight: 140,
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
          No budget category data yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 216px",
        gap: 1.75,
        alignItems: "center",
      }}
    >
      <Stack spacing={1.25} sx={{ minWidth: 0 }}>
        {slices.map((slice) => (
          <BudgetBreakdownRow
            key={slice.label}
            color={slice.color}
            label={slice.label}
            percent={slice.percent}
            progress={slice.percent}
            value={formatDashboardCurrency(slice.amount)}
          />
        ))}
      </Stack>

      <Box
        aria-label="Budget distribution chart by category"
        component="svg"
        role="img"
        viewBox="0 0 216 216"
        sx={{ width: 216, height: 216, flexShrink: 0 }}
      >
        <circle
          cx="108"
          cy="108"
          fill="none"
          r="68"
          stroke="rgba(0, 0, 0, 0.07)"
          strokeWidth="20"
        />
        {chartSegments.map(({ offset, segmentLength, slice }) => (
          <circle
            key={slice.label}
            cx="108"
            cy="108"
            fill="none"
            r="68"
            stroke={slice.color}
            strokeDasharray={`${segmentLength} ${
              circumference - segmentLength
            }`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            strokeWidth="20"
            transform="rotate(-90 108 108)"
          />
        ))}
        <circle cx="108" cy="108" fill="white" r="48" />
        <text
          dominantBaseline="middle"
          fill="#6b7280"
          fontSize="12"
          fontWeight="700"
          textAnchor="middle"
          x="108"
          y="98"
        >
          Total
        </text>
        <text
          dominantBaseline="middle"
          fill="#111827"
          fontSize="16"
          fontWeight="900"
          textAnchor="middle"
          x="108"
          y="118"
        >
          {formatDashboardCurrency(total)}
        </text>
      </Box>
    </Box>
  );
};

type BudgetSummaryProps = {
  initialBudget?: number | null;
  totalActualCost?: number | null;
};

const BudgetSummary = ({
  initialBudget,
  totalActualCost,
}: BudgetSummaryProps) => {
  const remainingBudget = (initialBudget ?? 0) - (totalActualCost ?? 0);
  const isOverBudget = remainingBudget < 0;

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignItems: "flex-end", justifyContent: "space-between" }}
    >
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
          {isOverBudget ? "Over budget" : "Remaining"}
        </Typography>
        <Typography
          color={isOverBudget ? "error.main" : "text.primary"}
          sx={{ fontSize: 24, fontWeight: 900, lineHeight: 1.2 }}
        >
          {formatDashboardCurrency(Math.abs(remainingBudget))}
        </Typography>
      </Box>
      <Stack spacing={0.25} sx={{ textAlign: "right" }}>
        <Typography color="text.secondary" sx={{ fontSize: 12 }}>
          Estimated
        </Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 800 }}>
          {formatDashboardCurrency(initialBudget)}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 12 }}>
          Actual
        </Typography>
        <Typography
          color={isOverBudget ? "error.main" : "success.main"}
          sx={{ fontSize: 13, fontWeight: 800 }}
        >
          {formatDashboardCurrency(totalActualCost)}
        </Typography>
      </Stack>
    </Stack>
  );
};

export const DashboardSidePanels = ({
  budgetSummary,
  dashboard,
  isBudgetSummaryLoading = false,
  tripId,
}: DashboardSidePanelsProps) => {
  const packingProgress = dashboard.packingProgress;
  const budgetUsage = dashboard.budgetUsage;
  const budgetTone = getBudgetWarningTone(budgetUsage?.warningLevel);

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <ChecklistOutlinedIcon color="success" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Packing progress
              </Typography>
            </Stack>
            <Button
              component={RouterLink}
              size="small"
              to={buildTripPackingPath(tripId)}
              variant="outlined"
              sx={{ minHeight: 32, px: 1.5, fontSize: 13 }}
            >
              Open checklist
            </Button>
          </Stack>

          <LinearProgress
            aria-label="Packing progress"
            color="success"
            value={clampDashboardPercent(packingProgress?.percent)}
            variant="determinate"
            sx={{ height: 8, borderRadius: 999 }}
          />
          <Typography color="text.secondary">
            {packingProgress?.packed ?? 0} packed from{" "}
            {packingProgress?.total ?? 0} items (
            {formatDashboardPercent(packingProgress?.percent)})
          </Typography>
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 2,
          borderColor:
            budgetTone === "error"
              ? "error.light"
              : budgetTone === "warning"
                ? "warning.light"
                : "divider",
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <AccountBalanceWalletOutlinedIcon color={budgetTone} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Budget usage
              </Typography>
            </Stack>
            <Button
              component={RouterLink}
              size="small"
              to={buildTripBudgetPath(tripId)}
              variant="outlined"
              sx={{ minHeight: 32, px: 1.5, fontSize: 13 }}
            >
              View budget
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Chip
              color={budgetTone}
              label={getBudgetWarningLabel(budgetUsage?.warningLevel)}
              size="small"
            />
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              {formatDashboardPercent(budgetUsage?.percent)} used
            </Typography>
          </Stack>
          <BudgetCategoryDistributionChart
            categorySummaries={budgetSummary?.categorySummaries}
            isLoading={isBudgetSummaryLoading}
          />
          <BudgetSummary
            initialBudget={
              budgetSummary?.initialBudget ?? budgetUsage?.initialBudget
            }
            totalActualCost={
              budgetSummary?.totalActualCost ?? budgetUsage?.totalActualCost
            }
          />
        </Stack>
      </Paper>
    </Stack>
  );
};
