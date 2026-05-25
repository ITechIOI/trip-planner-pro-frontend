import { useState, type FormEvent } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import {
  TripMemberRole,
  type TripMemberRole as TripMemberRoleValue,
} from "@/shared";

export type TripMemberFormValues = {
  email: string;
  role: TripMemberRoleValue;
};

export type TripMemberFormProps = {
  isPending?: boolean;
  submitError?: string | null;
  onSubmit: (values: TripMemberFormValues, onSuccess: () => void) => void;
};

export const TripMemberForm = ({
  isPending = false,
  submitError,
  onSubmit,
}: TripMemberFormProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TripMemberRoleValue>(TripMemberRole.VIEW);
  const [emailError, setEmailError] = useState<string | null>(null);

  const reset = () => {
    setEmail("");
    setRole(TripMemberRole.VIEW);
    setEmailError(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      setEmailError("Member email is required");
      return;
    }

    setEmailError(null);
    onSubmit({ email, role }, reset);
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <BoxHeader />
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}
        <Stack
          component="form"
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          onSubmit={handleSubmit}
          sx={{
            alignItems: { md: "flex-start" },
            justifyContent: { md: "space-between" },
            width: "100%",
          }}
        >
          <TextField
            label="Member Email"
            type="email"
            placeholder="e.g., abc@email.com"
            size="small"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={Boolean(emailError)}
            helperText={emailError}
            disabled={isPending}
            sx={{
              width: { xs: "100%", md: 420 },
              flexShrink: 0,
            }}
          />
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            sx={{
              flex: { md: 1 },
              alignItems: { md: "flex-start" },
              justifyContent: { md: "flex-end" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                value={role}
                disabled={isPending}
                onChange={(event) =>
                  setRole(event.target.value as TripMemberRoleValue)
                }
              >
                <MenuItem value={TripMemberRole.EDIT}>Editor</MenuItem>
                <MenuItem value={TripMemberRole.VIEW}>Viewer</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              size="small"
              startIcon={<PersonAddAltOutlinedIcon />}
              disabled={isPending}
              sx={{ minHeight: 40, py: 0.75 }}
            >
              Invite
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

const BoxHeader = () => (
  <Stack spacing={0.5}>
    <Typography variant="h6" sx={{ fontWeight: 700 }}>
      Invite member
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Update the details of trip members.
    </Typography>
  </Stack>
);
