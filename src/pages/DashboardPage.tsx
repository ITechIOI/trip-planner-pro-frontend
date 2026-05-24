import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FlightTakeoffOutlinedIcon from "@mui/icons-material/FlightTakeoffOutlined";
import dashboardIcon from "@/assets/images/dashboard.png";
import { buildTripItineraryPath, buildTripsPath } from "@/app/router";
import { useTrips } from "@/features/trips/api/use-trip-action";
import type { TripPageResponse, TripResponse } from "@/shared";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const tripsQuery = useTrips({ offset: 0, limit: 1 });
  const tripsPage = tripsQuery.data as TripPageResponse | undefined;
  const trips = useMemo(
    () => (tripsPage?.items ?? []) as TripResponse[],
    [tripsPage],
  );
  const firstTripId = trips[0]?.id;

  const openItineraries = () => {
    if (firstTripId) {
      navigate(buildTripItineraryPath(firstTripId));
      return;
    }

    navigate(buildTripsPath());
  };

  return (
    <Box component="main" sx={{ minHeight: "calc(100vh - 64px)", p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: { xs: 3, sm: 5 },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{
            alignItems: { md: "center" },
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box
                component="img"
                src={dashboardIcon}
                alt="Dashboard"
                sx={{ width: 40, height: 40 }}
              />
              <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
                Dashboard
              </Typography>
            </Stack>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 560 }}>
              You are signed in to Trip Planner Pro. Manage your trips or jump
              into the itinerary for your first trip.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<FlightTakeoffOutlinedIcon />}
              onClick={() => navigate(buildTripsPath())}
            >
              Trip Management
            </Button>
            <Button
              variant="outlined"
              startIcon={<CalendarMonthOutlinedIcon />}
              disabled={tripsQuery.isLoading}
              onClick={openItineraries}
            >
              Itineraries
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};
