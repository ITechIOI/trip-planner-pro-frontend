import { useMemo, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import HotelIcon from "@mui/icons-material/Hotel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import type {
  ItineraryResponse,
  ItineraryStatus,
  UpdateItineraryMutationError,
} from "@/shared";
import {
  ItineraryCategory,
  ItineraryStatus as ItineraryStatusEnum,
} from "@/shared";
import { useUpdateItineraryAction } from "../api/use-itinerary-action";
import {
  ITINERARY_STATUSES,
  normalizeItineraryFromApi,
} from "../api/itinerary-mappers";
import { getItinerariesErrorMessage } from "../lib/itineraries-error";

export type ItineraryCardProps = {
  tripId: number;
  item: ItineraryResponse;
  onEdit: (item: ItineraryResponse) => void;
  onDelete: (item: ItineraryResponse) => void;
  isActionPending?: boolean;
  viewMode?: "view" | "edit";
};

const categoryIcons: Record<ItineraryCategory, SvgIconComponent> = {
  TRANSPORT: DirectionsCarIcon,
  FOOD: RestaurantIcon,
  SIGHTSEEING: PhotoCameraOutlinedIcon,
  SHOPPING: ShoppingBagOutlinedIcon,
  HOTEL: HotelIcon,
  OTHER: MoreHorizIcon,
};

const categoryColors: Record<
  ItineraryCategory,
  { bgcolor: string; color: string }
> = {
  TRANSPORT: { bgcolor: "rgba(14, 165, 233, 0.12)", color: "#0284c7" },
  FOOD: { bgcolor: "rgba(249, 115, 22, 0.12)", color: "#ea580c" },
  SIGHTSEEING: { bgcolor: "rgba(139, 92, 246, 0.12)", color: "#7c3aed" },
  SHOPPING: { bgcolor: "rgba(236, 72, 153, 0.12)", color: "#db2777" },
  HOTEL: { bgcolor: "rgba(34, 197, 94, 0.12)", color: "#16a34a" },
  OTHER: { bgcolor: "rgba(100, 116, 139, 0.12)", color: "#475569" },
};

const priorityColors = {
  LOW: { bgcolor: "rgba(34, 197, 94, 0.12)", color: "#16a34a" },
  MEDIUM: { bgcolor: "rgba(245, 158, 11, 0.12)", color: "#d97706" },
  HIGH: { bgcolor: "rgba(239, 68, 68, 0.12)", color: "#dc2626" },
} as const;

const statusColors = {
  PLANNED: { bgcolor: "rgba(59, 130, 246, 0.12)", color: "#2563eb" },
  IN_PROGRESS: { bgcolor: "rgba(245, 158, 11, 0.12)", color: "#d97706" },
  DONE: { bgcolor: "rgba(34, 197, 94, 0.12)", color: "#16a34a" },
} as const;

const formatTimeRange = (
  startTime?: string | null,
  endTime?: string | null,
) => {
  const startDisplay = startTime
    ? (startTime.split("T")[1]?.substring(0, 5) ?? "No time")
    : "No time";
  const endDisplay = endTime ? endTime.split("T")[1]?.substring(0, 5) : null;

  return endDisplay ? `${startDisplay} - ${endDisplay}` : startDisplay;
};

export const ItineraryCard = ({
  tripId,
  item,
  onEdit,
  onDelete,
  isActionPending = false,
  viewMode = "edit",
}: ItineraryCardProps) => {
  const normalizedItem = useMemo(
    () => normalizeItineraryFromApi(item) ?? item,
    [item],
  );
  const updateMutation = useUpdateItineraryAction();
  const isViewMode = viewMode === "view";

  const category: ItineraryCategory =
    normalizedItem.category ?? ItineraryCategory.OTHER;
  const priority = normalizedItem.priority ?? "MEDIUM";
  const status: ItineraryStatus =
    normalizedItem.status ?? ItineraryStatusEnum.PLANNED;
  const Icon = categoryIcons[category] ?? MoreHorizIcon;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const itemDateTime = normalizedItem.startTime
    ? new Date(normalizedItem.startTime)
    : null;
  const isOverdue =
    status === ItineraryStatusEnum.PLANNED &&
    itemDateTime != null &&
    itemDateTime < today;

  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const cardBorderColor = isOverdue
    ? "error.light"
    : status === ItineraryStatusEnum.DONE
      ? "success.light"
      : status === ItineraryStatusEnum.IN_PROGRESS
        ? "warning.light"
        : "divider";

  const cardBackgroundColor = isOverdue
    ? "rgba(239, 68, 68, 0.06)"
    : status === ItineraryStatusEnum.DONE
      ? "rgba(34, 197, 94, 0.06)"
      : status === ItineraryStatusEnum.IN_PROGRESS
        ? "rgba(245, 158, 11, 0.06)"
        : "background.paper";

  const handleStatusChange = async (newStatus: ItineraryStatus) => {
    setStatusMenuAnchor(null);

    if (normalizedItem.id == null) {
      return;
    }

    await updateMutation.mutateAsync({
      tripId,
      itineraryId: normalizedItem.id,
      data: { status: newStatus },
    });
  };

  const handleDelete = () => {
    if (normalizedItem.id == null) {
      return;
    }

    onDelete(normalizedItem);
  };

  const mutationError = updateMutation.error ?? null;
  const mutationErrorMessage = mutationError
    ? getItinerariesErrorMessage(mutationError as UpdateItineraryMutationError)
    : null;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderColor: cardBorderColor,
        bgcolor: cardBackgroundColor,
        opacity: status === ItineraryStatusEnum.DONE ? 0.85 : 1,
        "&:hover .itinerary-card-actions": {
          opacity: 1,
        },
      }}
    >
      {mutationErrorMessage ? (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {mutationErrorMessage}
        </Alert>
      ) : null}

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            ...categoryColors[category],
          }}
        >
          <Icon fontSize="small" />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    textDecoration:
                      status === ItineraryStatusEnum.DONE
                        ? "line-through"
                        : "none",
                    color:
                      status === ItineraryStatusEnum.DONE
                        ? "text.secondary"
                        : "text.primary",
                  }}
                  noWrap
                >
                  {normalizedItem.activityTitle}
                </Typography>

                {isOverdue ? (
                  <Chip
                    size="small"
                    color="error"
                    icon={<ErrorOutlineOutlinedIcon />}
                    label="Overdue"
                  />
                ) : null}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 0.5, sm: 2 },
                  mt: 0.75,
                  color: "text.secondary",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {formatTimeRange(
                      normalizedItem.startTime,
                      normalizedItem.endTime,
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    minWidth: 0,
                  }}
                >
                  <LocationOnOutlinedIcon
                    sx={{ fontSize: 16, flexShrink: 0 }}
                  />
                  <Typography variant="body2" noWrap>
                    {normalizedItem.location}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: 1.5,
                }}
              >
                <Chip
                  size="small"
                  label={priority.toLowerCase()}
                  sx={priorityColors[priority]}
                />
                <Chip
                  size="small"
                  label={category.toLowerCase()}
                  sx={categoryColors[category]}
                />

                {!isViewMode ? (
                  <>
                    <Button
                      size="small"
                      variant="outlined"
                      endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
                      onClick={(event) =>
                        setStatusMenuAnchor(event.currentTarget)
                      }
                      disabled={updateMutation.isPending}
                      sx={{
                        minHeight: 24,
                        px: 1,
                        fontSize: 12,
                        lineHeight: 1.2,
                        textTransform: "none",
                        ...statusColors[status],
                        "& .MuiButton-endIcon": {
                          ml: 0.5,
                        },
                      }}
                    >
                      {status === ItineraryStatusEnum.DONE && (
                        <CheckIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      )}
                      {status}
                    </Button>
                    <Menu
                      anchorEl={statusMenuAnchor}
                      open={Boolean(statusMenuAnchor)}
                      onClose={() => setStatusMenuAnchor(null)}
                    >
                      {ITINERARY_STATUSES.map((nextStatus) => (
                        <MenuItem
                          key={nextStatus}
                          selected={status === nextStatus}
                          onClick={() => handleStatusChange(nextStatus)}
                        >
                          {nextStatus.toLowerCase()}
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <Chip
                    size="small"
                    label={status.toLowerCase()}
                    sx={statusColors[status]}
                  />
                )}
              </Box>
            </Box>

            {!isViewMode ? (
              <Box
                className="itinerary-card-actions"
                sx={{
                  display: "flex",
                  gap: 0.5,
                  opacity: { xs: 1, md: 0 },
                  transition: "opacity 0.2s",
                }}
              >
                <IconButton
                  size="small"
                  aria-label="Edit activity"
                  onClick={() => onEdit(normalizedItem)}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  aria-label="Delete activity"
                  onClick={handleDelete}
                  disabled={isActionPending}
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
