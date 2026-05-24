import { Link, matchPath, useLocation } from "react-router-dom";
import {
  buildTripDashboardPath,
  buildTripBudgetPath,
  buildTripItineraryPath,
  buildTripMembersPath,
  buildTripPackingPath,
  routePaths,
} from "@/app/router";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import {
  useTrip,
  useTripDashboard,
} from "@/features/trips/api/use-trip-action";
import { buildItineraryDashboardStats } from "@/features/itineraries/lib/itinerary-dashboard-stats";
import { normalizeTripFromApi } from "@/features/itineraries/api/itinerary-mappers";
import type { TripDashboardResponse, TripResponse } from "@/shared";

export type AppSidebarProps = {
  tripId: number;
};

type NavItem = {
  to: string;
  matchPath: string;
  label: string;
  icon: typeof DashboardOutlinedIcon;
  showAlertBadge?: boolean;
};

const buildNavItems = (tripId: number): NavItem[] => [
  {
    to: buildTripDashboardPath(tripId),
    matchPath: routePaths.tripDashboard,
    label: "Dashboard",
    icon: DashboardOutlinedIcon,
    showAlertBadge: true,
  },
  {
    to: buildTripItineraryPath(tripId),
    matchPath: routePaths.tripItinerary,
    label: "Itinerary",
    icon: EventNoteOutlinedIcon,
  },
  {
    to: buildTripMembersPath(tripId),
    matchPath: routePaths.tripMembers,
    label: "Members",
    icon: GroupOutlinedIcon,
  },
  {
    to: buildTripPackingPath(tripId),
    matchPath: routePaths.tripPacking,
    label: "Packing",
    icon: CheckBoxOutlinedIcon,
  },
  {
    to: buildTripBudgetPath(tripId),
    matchPath: routePaths.tripBudget,
    label: "Budget",
    icon: AccountBalanceWalletOutlinedIcon,
  },
];

export const AppSidebar = ({ tripId }: AppSidebarProps) => {
  const { pathname } = useLocation();
  const navItems = buildNavItems(tripId);

  const tripQuery = useTrip(tripId);
  const dashboardQuery = useTripDashboard(tripId);
  const trip = normalizeTripFromApi(tripQuery.data as TripResponse | undefined);
  const stats = buildItineraryDashboardStats(
    dashboardQuery.data as TripDashboardResponse | undefined,
  );
  const itineraryDonePercentage = stats.totalActivities
    ? Math.round((stats.completedActivities / stats.totalActivities) * 100)
    : 0;

  return (
    <Box
      component="aside"
      sx={{
        position: "fixed",
        left: 0,
        top: 64,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        width: { xs: 72, md: 256 },
        height: "calc(100vh - 64px)",
        bgcolor: "#0f172a",
        color: "#e2e8f0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(18, 132, 248, 0.2)",
          }}
        >
          <FlightTakeoffOutlinedIcon sx={{ color: "#38bdf8" }} />
        </Box>
        <Box
          sx={{ minWidth: 0, flex: 1, display: { xs: "none", md: "block" } }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
            Trip Planner Pro
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "rgba(226, 232, 240, 0.7)" }}
            noWrap
          >
            {trip?.tripName}
          </Typography>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {navItems.map((item) => {
          const isActive = Boolean(
            matchPath({ path: item.matchPath, end: true }, pathname),
          );
          const Icon = item.icon;

          const link = (
            <ListItemButton
              aria-label={item.label}
              component={Link}
              to={item.to}
              selected={isActive}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: isActive ? "#fff" : "rgba(226, 232, 240, 0.75)",
                bgcolor: isActive ? "primary.main" : "transparent",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "#fff",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ display: { xs: "none", md: "block" } }}
              />
              {item.showAlertBadge &&
                (stats.hasOverdueActivities || stats.isBudgetCritical) && (
                  <Box
                    component="span"
                    sx={{
                      ml: "auto",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      bgcolor: "error.main",
                      color: "error.contrastText",
                      fontSize: 10,
                      fontWeight: 700,
                      placeItems: "center",
                      display: { xs: "none", md: "grid" },
                    }}
                  >
                    !
                  </Box>
                )}
            </ListItemButton>
          );

          return <Box key={item.to}>{link}</Box>;
        })}
      </List>

      <Box
        sx={{
          mx: 1.5,
          mb: 1.5,
          p: 1.5,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.06)",
          display: { xs: "none", md: "block" },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "rgba(226, 232, 240, 0.55)",
            textTransform: "uppercase",
          }}
        >
          Quick Statistics
        </Typography>
        <StatRow label="Itinerary" value={`${itineraryDonePercentage}%`} />
        <LinearProgress
          variant="determinate"
          value={itineraryDonePercentage}
          sx={{ mb: 1.5, height: 6, borderRadius: 999 }}
        />
        <StatRow
          label="Packing"
          value={`${stats.packingCompletionPercentage}%`}
        />
        <LinearProgress
          variant="determinate"
          value={stats.packingCompletionPercentage}
          color="secondary"
          sx={{ mb: 1.5, height: 6, borderRadius: 999 }}
        />
        <StatRow
          label="Budget"
          value={`${stats.budgetUsagePercentage}%`}
          valueColor={
            stats.isBudgetCritical
              ? "error.light"
              : stats.isBudgetWarning
                ? "warning.light"
                : undefined
          }
        />
        <LinearProgress
          variant="determinate"
          value={Math.min(stats.budgetUsagePercentage, 100)}
          color={
            stats.isBudgetCritical
              ? "error"
              : stats.isBudgetWarning
                ? "warning"
                : "primary"
          }
          sx={{ height: 6, borderRadius: 999 }}
        />
      </Box>
    </Box>
  );
};

type StatRowProps = {
  label: string;
  value: string;
  valueColor?: string;
};

const StatRow = ({ label, value, valueColor }: StatRowProps) => (
  <Box
    sx={{ display: "flex", justifyContent: "space-between", mt: 1.5, mb: 0.5 }}
  >
    <Typography variant="body2" sx={{ color: "rgba(226, 232, 240, 0.7)" }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, color: valueColor }}>
      {value}
    </Typography>
  </Box>
);
