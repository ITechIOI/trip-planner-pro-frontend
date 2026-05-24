import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import type { TripResponse } from "@/shared";
import {
  formatTripBudget,
  formatTripDateRange,
  getTripAccessColor,
  getTripAccessLabel,
  type TripAccess,
} from "../lib";

export type TripListProps = {
  accessByTripId: Record<number, TripAccess>;
  trips: TripResponse[];
  offset?: number;
  isActionPending?: boolean;
  onDelete: (trip: TripResponse) => void;
  onEdit: (trip: TripResponse) => void;
  onMembers: (trip: TripResponse) => void;
  onOpen: (trip: TripResponse) => void;
};

const getAccess = (
  trip: TripResponse,
  accessByTripId: Record<number, TripAccess>,
) => (trip.id ? accessByTripId[trip.id] : undefined);

export const TripList = ({
  accessByTripId,
  trips,
  offset = 0,
  isActionPending = false,
  onDelete,
  onEdit,
  onMembers,
  onOpen,
}: TripListProps) => {
  const theme = useTheme();
  const isTableLayout = useMediaQuery(theme.breakpoints.up("md"));

  if (!isTableLayout) {
    return (
      <Stack spacing={1.5} sx={{ px: 2, pb: 2 }}>
        {trips.map((trip, index) => {
          const access = getAccess(trip, accessByTripId);

          return (
            <Paper
              key={trip.id ?? `${trip.name}-${index}`}
              variant="outlined"
              sx={{ display: "grid", gap: 1.5, p: 2 }}
            >
              <Box>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 12, fontWeight: 800 }}
                >
                  No. {offset + index + 1}
                </Typography>
                <Typography
                  component="h2"
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  {trip.name ?? "Untitled trip"}
                </Typography>
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{
                    alignItems: "center",
                    color: "text.secondary",
                    mt: 0.75,
                  }}
                >
                  <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {formatTripDateRange(trip)}
                  </Typography>
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Budget: {formatTripBudget(trip.estimatedBudget)}
                </Typography>
                <Chip
                  size="small"
                  sx={{ mt: 1 }}
                  color={getTripAccessColor(access?.role ?? null)}
                  label={getTripAccessLabel(access?.role ?? null)}
                />
              </Box>

              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<LaunchOutlinedIcon />}
                  onClick={() => onOpen(trip)}
                >
                  Open
                </Button>
                {access?.canViewMembers ? (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<GroupOutlinedIcon />}
                    onClick={() => onMembers(trip)}
                  >
                    Member List
                  </Button>
                ) : null}
                {access?.canEditTrip ? (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => onEdit(trip)}
                  >
                    Edit
                  </Button>
                ) : null}
                {access?.canDeleteTrip ? (
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteOutlinedIcon />}
                    disabled={isActionPending}
                    onClick={() => onDelete(trip)}
                  >
                    Delete
                  </Button>
                ) : null}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    );
  }

  return (
    <TableContainer
      sx={{
        borderTop: 1,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Table aria-label="Trips">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 72 }} align="center">
              No.
            </TableCell>
            <TableCell align="center">Trip name</TableCell>
            <TableCell align="center">Date Range</TableCell>
            <TableCell align="center">Estimated Budget</TableCell>
            <TableCell align="center">Your role</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trips.map((trip, index) => {
            const access = getAccess(trip, accessByTripId);

            return (
              <TableRow key={trip.id ?? `${trip.name}-${index}`}>
                <TableCell
                  align="center"
                  sx={{ color: "text.secondary", fontWeight: 800 }}
                >
                  {offset + index + 1}
                </TableCell>
                <TableCell align="center">
                  <Typography sx={{ fontWeight: 700 }}>
                    {trip.name ?? "Untitled trip"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {formatTripDateRange(trip)}
                </TableCell>
                <TableCell align="center">
                  {formatTripBudget(trip.estimatedBudget)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    size="small"
                    color={getTripAccessColor(access?.role ?? null)}
                    label={getTripAccessLabel(access?.role ?? null)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ justifyContent: "center" }}
                  >
                    <IconButton
                      size="small"
                      aria-label="Open trip"
                      onClick={() => onOpen(trip)}
                    >
                      <LaunchOutlinedIcon fontSize="small" />
                    </IconButton>
                    {access?.canViewMembers ? (
                      <IconButton
                        size="small"
                        aria-label="Member List"
                        onClick={() => onMembers(trip)}
                      >
                        <GroupOutlinedIcon fontSize="small" />
                      </IconButton>
                    ) : null}
                    {access?.canEditTrip ? (
                      <IconButton
                        size="small"
                        aria-label="Edit trip"
                        onClick={() => onEdit(trip)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    ) : null}
                    {access?.canDeleteTrip ? (
                      <IconButton
                        size="small"
                        color="error"
                        aria-label="Delete trip"
                        disabled={isActionPending}
                        onClick={() => onDelete(trip)}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    ) : null}
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
