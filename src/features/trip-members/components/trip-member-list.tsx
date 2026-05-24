import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  TripMemberRole,
  type TripMemberResponse,
  type TripMemberRole as TripMemberRoleValue,
  type UserResponse,
} from "@/shared";

export type TripMemberListProps = {
  canManageMembers: boolean;
  isActionPending?: boolean;
  members: TripMemberResponse[];
  offset?: number;
  onDelete: (member: TripMemberResponse) => void;
  onRoleChange: (member: TripMemberResponse, role: TripMemberRoleValue) => void;
};

type UserWithOptionalName = UserResponse & { name?: string };

const getInitials = (title: string) => {
  const source = title.trim() || "Trip member";
  const initials = source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "TM";
};

const getMemberDisplay = (member: TripMemberResponse) => {
  const user = member.user as UserWithOptionalName | undefined;
  const title =
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email ||
    "Trip member";
  const detail = user?.email && user.email !== title ? user.email : "";

  return {
    user,
    title,
    detail,
  };
};

const getRoleLabel = (role?: TripMemberRoleValue) =>
  role === TripMemberRole.EDIT ? "Editor" : "Viewer";

export const TripMemberList = ({
  canManageMembers,
  isActionPending = false,
  members,
  offset = 0,
  onDelete,
  onRoleChange,
}: TripMemberListProps) => {
  const theme = useTheme();
  const isTableLayout = useMediaQuery(theme.breakpoints.up("md"));

  if (!isTableLayout) {
    return (
      <Stack spacing={1.5}>
        {members.map((member, index) => {
          const display = getMemberDisplay(member);

          return (
            <Paper
              key={member.id ?? `${member.userId}-${index}`}
              variant="outlined"
              sx={{ display: "grid", gap: 1.5, p: 2 }}
            >
              <Stack
                direction="row"
                spacing={1.25}
                sx={{ alignItems: "center" }}
              >
                <Avatar
                  alt={display.title}
                  src={display.user?.avatarUrl ?? undefined}
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  {getInitials(display.title)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: 12, fontWeight: 800 }}
                  >
                    No. {offset + index + 1}
                  </Typography>
                  <Typography component="h2" sx={{ fontWeight: 700 }}>
                    {display.title}
                  </Typography>
                  {display.detail ? (
                    <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                      {display.detail}
                    </Typography>
                  ) : null}
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                {canManageMembers ? (
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      value={member.role ?? TripMemberRole.VIEW}
                      onChange={(event) =>
                        onRoleChange(
                          member,
                          event.target.value as TripMemberRoleValue,
                        )
                      }
                      disabled={isActionPending}
                    >
                      <MenuItem value={TripMemberRole.EDIT}>Editor</MenuItem>
                      <MenuItem value={TripMemberRole.VIEW}>Viewer</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <Chip
                    size="small"
                    color={
                      member.role === TripMemberRole.EDIT ? "warning" : "info"
                    }
                    label={getRoleLabel(member.role)}
                  />
                )}
                {canManageMembers && member.id ? (
                  <IconButton
                    type="button"
                    color="error"
                    aria-label="Remove member"
                    disabled={isActionPending}
                    onClick={() => onDelete(member)}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                ) : null}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="Trip members" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 72 }} align="center">
              No.
            </TableCell>
            <TableCell sx={{ width: { md: 360, lg: 420 } }} align="center">
              Name and Email
            </TableCell>
            <TableCell sx={{ width: 220 }} align="center">
              Role
            </TableCell>
            {canManageMembers ? (
              <TableCell align="center" sx={{ width: 96 }}>
                Actions
              </TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member, index) => {
            const display = getMemberDisplay(member);

            return (
              <TableRow key={member.id ?? `${member.userId}-${index}`}>
                <TableCell
                  align="center"
                  sx={{ color: "text.secondary", fontWeight: 800 }}
                >
                  {offset + index + 1}
                </TableCell>
                <TableCell align="center">
                  <Stack
                    direction="row"
                    spacing={1.25}
                    sx={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Avatar
                      alt={display.title}
                      src={display.user?.avatarUrl ?? undefined}
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                      }}
                    >
                      {getInitials(display.title)}
                    </Avatar>
                    <Box sx={{ minWidth: 0, textAlign: "center" }}>
                      <Typography sx={{ fontWeight: 700 }} noWrap>
                        {display.title}
                      </Typography>
                      {display.detail ? (
                        <Typography
                          color="text.secondary"
                          sx={{ fontSize: 13 }}
                          noWrap
                        >
                          {display.detail}
                        </Typography>
                      ) : null}
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  {canManageMembers ? (
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        label="Role"
                        value={member.role ?? TripMemberRole.VIEW}
                        onChange={(event) =>
                          onRoleChange(
                            member,
                            event.target.value as TripMemberRoleValue,
                          )
                        }
                        disabled={isActionPending}
                      >
                        <MenuItem value={TripMemberRole.EDIT}>Editor</MenuItem>
                        <MenuItem value={TripMemberRole.VIEW}>Viewer</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Chip
                      size="small"
                      color={
                        member.role === TripMemberRole.EDIT ? "warning" : "info"
                      }
                      label={getRoleLabel(member.role)}
                    />
                  )}
                </TableCell>
                {canManageMembers ? (
                  <TableCell align="center">
                    {member.id ? (
                      <IconButton
                        type="button"
                        size="small"
                        color="error"
                        aria-label="Remove member"
                        disabled={isActionPending}
                        onClick={() => onDelete(member)}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    ) : null}
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
