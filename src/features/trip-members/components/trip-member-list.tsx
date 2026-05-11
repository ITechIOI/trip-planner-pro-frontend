import {
  Avatar,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Trash2, UserRound } from 'lucide-react'
import { tripPlannerColors } from '@/app/theme'
import {
  TripMemberRole,
  type TripMemberResponse,
  type UserResponse,
} from '@/shared'
import {
  ActionCluster,
  Button,
  CategoryIcon,
  StatusBadge,
} from '@/shared/components/ui'

type TripMemberListProps = {
  canManageMembers?: boolean
  members: TripMemberResponse[]
  offset?: number
  isActionPending?: boolean
  onDelete: (member: TripMemberResponse) => void
  onRoleChange: (member: TripMemberResponse, role: TripMemberRole) => void
}

const roleOptions = [
  { value: TripMemberRole.VIEW, label: 'View' },
  { value: TripMemberRole.EDIT, label: 'Edit' },
]

type UserWithOptionalName = UserResponse & { name?: string }

const getInitials = (title: string) => {
  const source = title.trim() || 'Trip member'

  const initials = source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return initials || 'TM'
}

const getMemberDisplay = (member: TripMemberResponse) => {
  const user = member.user as UserWithOptionalName | undefined
  const title =
    user?.fullName || user?.name || user?.username || user?.email || 'Trip member'
  const detail = user?.email && user.email !== title ? user.email : ''

  return {
    user,
    title,
    detail,
  }
}

export const TripMemberList = ({
  canManageMembers = true,
  members,
  offset = 0,
  isActionPending = false,
  onDelete,
  onRoleChange,
}: TripMemberListProps) => {
  const theme = useTheme()
  const isTableLayout = useMediaQuery(theme.breakpoints.up('md'))

  if (!isTableLayout) {
    return (
      <Stack className="member-list" spacing={1.5}>
        {members.map((member, index) => {
          const display = getMemberDisplay(member)

          return (
            <Paper
              className="member-row"
              component="article"
              data-testid="member-row"
              key={member.id ?? `${member.userId}-${index}`}
              variant="outlined"
              sx={{
                display: 'grid',
                gap: 1.5,
                p: 2,
                borderColor: tripPlannerColors.border,
              }}
            >
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                <Avatar
                  alt={display.title}
                  src={display.user?.avatarUrl ?? undefined}
                  sx={{
                    bgcolor: tripPlannerColors.primaryStrong,
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {getInitials(display.title)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
                    No. {offset + index + 1}
                  </Typography>
                  <Typography component="h2" variant="h3">
                    {display.title}
                  </Typography>
                  {display.detail ? (
                    <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                      {display.detail}
                    </Typography>
                  ) : null}
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <StatusBadge tone={member.role === TripMemberRole.EDIT ? 'warning' : 'info'}>
                  {member.role === TripMemberRole.EDIT ? 'Edit' : 'View'}
                </StatusBadge>
                {canManageMembers ? (
                  <TextField
                    select
                    label="Role"
                    size="small"
                    slotProps={{ select: { native: true } }}
                    sx={{ minWidth: 140 }}
                    value={member.role ?? TripMemberRole.VIEW}
                    onChange={(event) =>
                      onRoleChange(member, event.target.value as TripMemberRole)
                    }
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                ) : null}
                {canManageMembers && member.id ? (
                  <Button
                    disabled={isActionPending}
                    type="button"
                    variant="danger"
                    onClick={() => onDelete(member)}
                  >
                    <Trash2 size={15} />
                    Delete
                  </Button>
                ) : null}
              </Stack>
            </Paper>
          )
        })}
      </Stack>
    )
  }

  return (
    <TableContainer
      className="member-table"
      component={Paper}
      variant="outlined"
      sx={{ borderColor: tripPlannerColors.border }}
    >
      <Table aria-label="Trip members" sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 72 }}>No.</TableCell>
            <TableCell>Member</TableCell>
            <TableCell sx={{ width: 180 }}>Role</TableCell>
            {canManageMembers ? (
              <TableCell align="right" sx={{ width: 220 }}>Actions</TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member, index) => {
            const display = getMemberDisplay(member)

            return (
              <TableRow
                className="member-row"
                data-testid="member-row"
                key={member.id ?? `${member.userId}-${index}`}
              >
                <TableCell sx={{ color: 'text.secondary', fontWeight: 800, width: 72 }}>
                  {offset + index + 1}
                </TableCell>
                <TableCell sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                    <Avatar
                      alt={display.title}
                      src={display.user?.avatarUrl ?? undefined}
                      sx={{
                        bgcolor: tripPlannerColors.primaryStrong,
                        color: '#FFFFFF',
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    >
                      {getInitials(display.title)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography component="h2" variant="h3">
                        {display.title}
                      </Typography>
                      {display.detail ? (
                        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                          {display.detail}
                        </Typography>
                      ) : null}
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ width: 180 }}>
                  {canManageMembers ? (
                    <TextField
                      select
                      label="Role"
                      size="small"
                      slotProps={{ select: { native: true } }}
                      sx={{ minWidth: 140, width: 150 }}
                      value={member.role ?? TripMemberRole.VIEW}
                      onChange={(event) =>
                        onRoleChange(member, event.target.value as TripMemberRole)
                      }
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  ) : (
                    <StatusBadge tone={member.role === TripMemberRole.EDIT ? 'warning' : 'info'}>
                      {member.role === TripMemberRole.EDIT ? 'Edit' : 'View'}
                    </StatusBadge>
                  )}
                </TableCell>
                {canManageMembers ? (
                  <TableCell align="right" sx={{ width: 220 }}>
                    <ActionCluster>
                      <CategoryIcon
                        icon={<UserRound size={17} />}
                        label="Role"
                        tone={member.role === TripMemberRole.EDIT ? 'warning' : 'info'}
                      />
                      {member.id ? (
                        <Button
                          disabled={isActionPending}
                          type="button"
                          variant="danger"
                          onClick={() => onDelete(member)}
                        >
                          <Trash2 size={15} />
                          Delete
                        </Button>
                      ) : null}
                    </ActionCluster>
                  </TableCell>
                ) : null}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
