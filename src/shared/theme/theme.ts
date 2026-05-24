import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1284f8',
      contrastText: '#ffffff',
    },
    success: {
      main: '#28a895',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#050505',
      secondary: '#8c8c8c',
    },
  },
  typography: {
    fontFamily:
      'Inter, Plus Jakarta Sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    button: {
      fontWeight: 500,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 56,
          borderRadius: 12,
          fontSize: 18,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
})
