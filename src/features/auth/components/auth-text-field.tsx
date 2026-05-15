import type { ReactNode } from "react";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  GlobalStyles,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";

type AuthTextFieldProps = Omit<
  TextFieldProps<"outlined">,
  "label" | "slotProps" | "variant"
> & {
  fieldLabel: string;
  icon: ReactNode;
  isPassword?: boolean;
};

const authInputFontStack =
  'Inter, Plus Jakarta Sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const authFieldWidth = "calc(100% - 15px)";

const authAutofillStyles = {
  ".auth-text-field input:-webkit-autofill, .auth-text-field input:-webkit-autofill:hover, .auth-text-field input:-webkit-autofill:focus":
    {
      WebkitBoxShadow: "0 0 0 1000px #f8fafc inset",
      WebkitTextFillColor: "#111827",
      caretColor: "#111827",
      fontSize: "15px !important",
      fontFamily: `${authInputFontStack} !important`,
      fontWeight: "500 !important",
      lineHeight: "1.5 !important",
      WebkitTextSizeAdjust: "100%",
    },
  ".auth-text-field input:-webkit-autofill::first-line": {
    fontSize: "15px !important",
    fontFamily: `${authInputFontStack} !important`,
    fontWeight: "500 !important",
    lineHeight: "1.5 !important",
  },
  "@media (min-width: 600px)": {
    ".auth-text-field input:-webkit-autofill, .auth-text-field input:-webkit-autofill:hover, .auth-text-field input:-webkit-autofill:focus":
      {
        fontSize: "16px !important",
      },
    ".auth-text-field input:-webkit-autofill::first-line": {
      fontSize: "16px !important",
    },
  },
};

export const AuthTextField = ({
  className,
  fieldLabel,
  icon,
  isPassword,
  sx,
  ...props
}: AuthTextFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const rootClassName = ["auth-text-field", className]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <GlobalStyles styles={authAutofillStyles} />
      <Typography
        component="label"
        htmlFor={props.id}
        sx={{
          display: "block",
          width: authFieldWidth,
          mx: "auto",
          alignSelf: "center",
          mb: 0.75,
          fontSize: { xs: 15, sm: 16 },
          lineHeight: 1.25,
          fontWeight: 600,
          color: "#1f2937",
        }}
      >
        {fieldLabel}
      </Typography>
      <Box sx={{ width: authFieldWidth, mx: "auto", alignSelf: "center" }}>
        <TextField
          {...props}
          className={rootClassName}
          fullWidth
          variant="outlined"
          type={isPassword && !isPasswordVisible ? "password" : "text"}
          slotProps={{
            htmlInput: {
              style: {
                fontSize: "var(--auth-input-font-size)",
                lineHeight: 1.5,
                fontFamily: "inherit",
                fontWeight: 500,
                WebkitTextSizeAdjust: "100%",
              },
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      color: props.error ? "#d32f2f" : "#5f6b7a",
                      "& svg": {
                        fontSize: { xs: 18, sm: 20 },
                      },
                    }}
                  >
                    {icon}
                  </Box>
                </InputAdornment>
              ),
              endAdornment: isPassword ? (
                <InputAdornment position="end" sx={{ mr: 0.5 }}>
                  <IconButton
                    aria-label={
                      isPasswordVisible ? "Hide password" : "Show password"
                    }
                    edge="end"
                    onClick={() => setIsPasswordVisible((current) => !current)}
                    size="medium"
                    sx={{
                      color: "#5f6b7a",
                      p: 0.5,
                      "& svg": {
                        fontSize: { xs: 18, sm: 20 },
                      },
                    }}
                  >
                    {isPasswordVisible ? (
                      <VisibilityIcon fontSize="large" />
                    ) : (
                      <VisibilityOffIcon fontSize="large" />
                    )}
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
          sx={{
            "--auth-input-font-size": { xs: "15px", sm: "16px" },
            "& .MuiOutlinedInput-root": {
              minHeight: { xs: 48, sm: 52 },
              borderRadius: "12px",
              bgcolor: "#f8fafc",
              fontSize: "var(--auth-input-font-size)",
              color: "#111827",
              "& fieldset": {
                borderRadius: "12px",
                borderColor: props.error ? "#d32f2f" : "#d8e0ea",
                borderWidth: 1,
              },
              "&:hover fieldset": {
                borderColor: props.error ? "#d32f2f" : "#c9d4e2",
              },
              "&.Mui-focused fieldset": {
                borderColor: props.error ? "#d32f2f" : "#1284f8",
                borderWidth: 2,
              },
            },
            "& .MuiOutlinedInput-input": {
              py: { xs: 1, sm: 1.25 },
              bgcolor: "#f8fafc",
              borderRadius: "12px",
              fontSize: "var(--auth-input-font-size)",
              lineHeight: 1.5,
              fontFamily: "inherit",
              fontWeight: 500,
              WebkitTextSizeAdjust: "100%",
              "&::placeholder": {
                color: "#8a94a3",
                fontSize: "var(--auth-input-font-size)",
                fontFamily: "inherit",
                opacity: 1,
              },
              "&:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 1000px #f8fafc inset",
                WebkitTextFillColor: "#111827",
                caretColor: "#111827",
                fontSize: "var(--auth-input-font-size)",
                fontFamily: "inherit",
                fontWeight: 500,
                lineHeight: 1.5,
                transition: "background-color 9999s ease-out",
              },
              "&:-webkit-autofill::first-line": {
                fontSize: "var(--auth-input-font-size)",
                fontFamily: "inherit",
                fontWeight: 500,
                lineHeight: 1.5,
              },
            },
            "& input.MuiOutlinedInput-input": {
              fontSize: "var(--auth-input-font-size)",
              lineHeight: 1.5,
              fontFamily: "inherit",
              fontWeight: 500,
              WebkitTextSizeAdjust: "100%",
            },
            "& input.MuiOutlinedInput-input:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 1000px #f8fafc inset",
              WebkitTextFillColor: "#111827",
              caretColor: "#111827",
              fontSize: "var(--auth-input-font-size)",
              lineHeight: 1.5,
              fontFamily: "inherit",
              fontWeight: 500,
              transition: "background-color 9999s ease-out",
            },
            "& input.MuiOutlinedInput-input:-webkit-autofill::first-line": {
              fontSize: "var(--auth-input-font-size)",
              lineHeight: 1.5,
              fontFamily: "inherit",
              fontWeight: 500,
            },
            "& .MuiFormHelperText-root": {
              mx: 1.5,
              mt: 0.5,
              fontSize: 12,
              color: props.error ? "#d32f2f" : "#5f6b7a",
            },
            ...sx,
          }}
        />
      </Box>
    </>
  );
};
