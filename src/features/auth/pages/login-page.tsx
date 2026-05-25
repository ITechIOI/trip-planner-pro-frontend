import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { routePaths } from "@/app/router";
import { useLoginAction } from "../api";
import { AuthLayout, AuthSubmitButton, AuthTextField } from "../components";
import { getLoginErrorMessage } from "../lib";
import { loginSchema, type LoginFormValues } from "../schemas";

export const LoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLoginAction({
    mutation: {
      onSuccess: () => {
        navigate(routePaths.trips, { replace: true });
      },
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({
      data: values,
    });
  };

  return (
    <AuthLayout
      background="login"
      topActionLabel="Sign Up"
      topActionTo={routePaths.signup}
    >
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Typography
          component="h1"
          sx={{
            mb: { xs: 3, md: 3.5 },
            textAlign: "center",
            fontSize: { xs: 28, md: 34 },
            lineHeight: 1.15,
            fontWeight: 700,
          }}
        >
          Log In to Your Account
        </Typography>

        <Stack spacing={{ xs: 2.25, md: 2.5 }}>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <AuthTextField
                {...field}
                id="login-username"
                autoComplete="username"
                fieldLabel="Username"
                placeholder="Enter your username or email"
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                icon={<AccountCircleOutlinedIcon fontSize="large" />}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <AuthTextField
                {...field}
                id="login-password"
                autoComplete="current-password"
                fieldLabel="Password"
                placeholder="Enter your password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                icon={<LockOutlinedIcon fontSize="large" />}
                isPassword
              />
            )}
          />

          {loginMutation.error ? (
            <Alert severity="error" role="alert">
              {getLoginErrorMessage(loginMutation.error)}
            </Alert>
          ) : null}

          <AuthSubmitButton disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Logging in..." : "Log In"}
          </AuthSubmitButton>
        </Stack>

        <Stack spacing={0.75} sx={{ mt: 2.25, textAlign: "center" }}>
          <MuiLink
            component={RouterLink}
            to={routePaths.recoverPassword}
            sx={{ color: "#6b7280", fontSize: { xs: 14, sm: 16 } }}
          >
            Forgot password?
          </MuiLink>
          <Typography sx={{ fontSize: { xs: 14, sm: 16 } }}>
            Don't have an account?{" "}
            <MuiLink
              component={RouterLink}
              to={routePaths.signup}
              color="inherit"
            >
              Register
            </MuiLink>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
};
