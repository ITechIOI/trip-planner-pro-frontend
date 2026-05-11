import { createTheme } from '@mui/material/styles'

export const tripPlannerColors = {
  canvas: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSoft: '#F1F5F9',
  ink: '#102033',
  muted: '#64748B',
  border: '#E2E8F0',
  primary: '#0EA5E9',
  primaryStrong: '#075985',
  secondary: '#0D9488',
  cta: '#C2410C',
  ctaHover: '#9A3412',
  success: '#16A34A',
  warning: '#D97706',
  critical: '#DC2626',
}

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: tripPlannerColors.primary,
      dark: tripPlannerColors.primaryStrong,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: tripPlannerColors.secondary,
      contrastText: '#FFFFFF',
    },
    success: {
      main: tripPlannerColors.success,
    },
    warning: {
      main: tripPlannerColors.warning,
    },
    error: {
      main: tripPlannerColors.critical,
    },
    background: {
      default: tripPlannerColors.canvas,
      paper: tripPlannerColors.surface,
    },
    text: {
      primary: tripPlannerColors.ink,
      secondary: tripPlannerColors.muted,
    },
    divider: tripPlannerColors.border,
  },
  typography: {
    fontFamily:
      "Inter, 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: {
      fontSize: '2rem',
      fontWeight: 800,
      lineHeight: 1.08,
      letterSpacing: 0,
    },
    h2: {
      fontSize: '1.2rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    h3: {
      fontSize: '1.05rem',
      fontWeight: 800,
      lineHeight: 1.25,
      letterSpacing: 0,
    },
    button: {
      fontWeight: 800,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(15, 23, 42, 0.04)',
    '0 8px 24px rgba(15, 23, 42, 0.08)',
    '0 18px 45px rgba(15, 23, 42, 0.08)',
    '0 20px 50px rgba(15, 23, 42, 0.12)',
    ...Array(20).fill('0 20px 50px rgba(15, 23, 42, 0.12)'),
  ] as typeof createTheme extends (...args: infer TArgs) => infer TTheme
    ? TTheme extends { shadows: infer TShadows }
      ? TShadows
      : never
    : never,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: 320,
          minHeight: '100svh',
          background:
            'linear-gradient(180deg, #ffffff 0%, #F8FAFC 38%)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 8,
          boxShadow: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: tripPlannerColors.surfaceSoft,
          color: '#475569',
          fontSize: 12,
          fontWeight: 850,
          letterSpacing: 0,
          textTransform: 'uppercase',
        },
        root: {
          borderColor: tripPlannerColors.border,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          letterSpacing: 0,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: tripPlannerColors.surface,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tripPlannerColors.primary,
            borderWidth: 2,
          },
        },
        input: {
          fontWeight: 600,
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small',
        fullWidth: true,
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#475569',
          fontWeight: 700,
          letterSpacing: 0,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#475569',
          fontWeight: 600,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#E0F2FE',
          color: tripPlannerColors.primaryStrong,
          fontWeight: 850,
        },
      },
    },
  },
})
