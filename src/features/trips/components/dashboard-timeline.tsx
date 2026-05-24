import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { buildTripItineraryPath } from "@/app/router/routePaths";
import { EmptyState } from "@/shared/components/empty-state";
import type { ItineraryResponse, TripDashboardResponse } from "@/shared";
import {
  formatDashboardDate,
  formatDashboardTimeRange,
  getItineraryStatusLabel,
  getItineraryStatusTone,
} from "../lib/dashboard-fields";

export type DashboardTimelineProps = {
  dashboard: TripDashboardResponse;
  tripId: number;
};

const hasTimelineItems = (dashboard: TripDashboardResponse) =>
  dashboard.itinerariesByDate?.some(
    (group) => (group.items?.length ?? 0) > 0,
  ) ?? false;

const TimelineItem = ({
  item,
  index,
}: {
  item: ItineraryResponse;
  index: number;
}) => {
  const timeRange = formatDashboardTimeRange(item.startTime, item.endTime);
  const statusTone = getItineraryStatusTone(item.status);

  return (
    <Paper
      component="article"
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {index + 1}
            </Box>
            <Typography sx={{ fontWeight: 700 }} noWrap>
              {item.activityTitle ?? "Untitled activity"}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 0.5, sm: 2 }}
            sx={{ mt: 1, color: "text.secondary" }}
          >
            {timeRange ? (
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: "center" }}
              >
                <AccessTimeOutlinedIcon sx={{ fontSize: 17 }} />
                <Typography variant="body2">{timeRange}</Typography>
              </Stack>
            ) : null}
            {item.location ? (
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: "center", minWidth: 0 }}
              >
                <PlaceOutlinedIcon sx={{ fontSize: 17, flexShrink: 0 }} />
                <Typography variant="body2" noWrap>
                  {item.location}
                </Typography>
              </Stack>
            ) : null}
          </Stack>
        </Box>

        <Chip
          color={statusTone}
          label={getItineraryStatusLabel(item.status)}
          size="small"
          sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
        />
      </Stack>
    </Paper>
  );
};

export const DashboardTimeline = ({
  dashboard,
  tripId,
}: DashboardTimelineProps) => {
  const hasItems = hasTimelineItems(dashboard);

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, minHeight: 420 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{
          justifyContent: "space-between",
          alignItems: { sm: "center" },
          mb: 2,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <EventNoteOutlinedIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Itinerary by date
            </Typography>
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Timeline grouped by travel day.
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          size="small"
          to={buildTripItineraryPath(tripId)}
          variant="outlined"
          sx={{ minHeight: 32, px: 1.5, fontSize: 13 }}
        >
          View itinerary
        </Button>
      </Stack>

      {hasItems ? (
        <Stack spacing={2}>
          {dashboard.itinerariesByDate?.map((group, groupIndex) => {
            const items = group.items ?? [];

            if (items.length === 0) {
              return null;
            }

            return (
              <Box
                component="section"
                key={`${group.date ?? "none"}-${groupIndex}`}
              >
                <Typography
                  component="h3"
                  color="text.secondary"
                  sx={{
                    fontSize: 13,
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  {formatDashboardDate(group.date)}
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {items.map((item, index) => (
                    <TimelineItem
                      key={item.id ?? `${group.date ?? "none"}-${index}`}
                      item={item}
                      index={index}
                    />
                  ))}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      ) : (
        <EmptyState
          icon={EventNoteOutlinedIcon}
          title="No itinerary items yet"
          description="Add activities to see this trip timeline grouped by date."
        />
      )}
    </Paper>
  );
};
