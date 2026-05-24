import type { ReactNode } from "react";
import { Box, Link as MuiLink, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import backgroundLogin from "@/assets/images/background_login.png";
import backgroundSignup from "@/assets/images/background_signup.jpg";
import { AuthBrand } from "./auth-brand";

type AuthLayoutProps = {
  background: "login" | "signup";
  topActionLabel: string;
  topActionTo: string;
  children: ReactNode;
};

const backgroundByVariant = {
  login: backgroundLogin,
  signup: backgroundSignup,
};

export const AuthLayout = ({
  background,
  topActionLabel,
  topActionTo,
  children,
}: AuthLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: "100svh",
        display: { xs: "block", md: "flex" },
        bgcolor: "#ffffff",
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "relative",
          flex: { md: "0 0 50%" },
          minHeight: { xs: 180, md: "100svh" },
          backgroundImage: `url(${backgroundByVariant[background]})`,
          backgroundPosition: background === "signup" ? "center" : "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          bgcolor: "#f4f1ed",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: { xs: 24, md: 80 },
            left: { xs: 20, md: "11%" },
          }}
        >
          <AuthBrand />
          <Typography
            sx={{
              mt: { xs: 1.25, md: 2 },
              ml: { xs: 0.25, md: 13 },
              color: "#ffffff",
              fontSize: { xs: 18, md: 28 },
              lineHeight: 1.2,
              fontWeight: 400,
              textShadow: "0 1px 12px rgba(0, 0, 0, 0.22)",
            }}
          >
            Plan Smarter. Travel Better
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: { md: "0 0 50%" },
          minHeight: { xs: "calc(100svh - 180px)", md: "100svh" },
          display: "flex",
          flexDirection: "column",
          bgcolor: "#ffffff",
          overflowY: "auto",
        }}
      >
        <Box
          component="header"
          sx={{
            minHeight: { xs: 56, md: 68 },
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            borderBottom: "1px solid #bdbdbd",
            px: { xs: 2.5, md: 5 },
          }}
        >
          <MuiLink
            component={RouterLink}
            to={topActionTo}
            underline="none"
            sx={{
              color: "#050505",
              fontSize: { xs: 16, md: 20 },
              fontWeight: 700,
            }}
          >
            {topActionLabel}
          </MuiLink>
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 2.5, sm: 4, lg: 5 },
            py: { xs: 3, md: 3 },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 532 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
};
