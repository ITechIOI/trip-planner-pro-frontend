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
      fontWeight: 700,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 8,
          boxShadow: 'none',
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1.4,
          paddingInline: 16,
          textTransform: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&.Mui-disabled': {
            boxShadow: 'none',
          },
        },
        sizeSmall: {
          minHeight: 36,
          fontSize: 13,
          paddingInline: 12,
        },
        sizeLarge: {
          minHeight: 44,
          fontSize: 15,
          paddingInline: 18,
        },
        outlined: {
          borderColor: 'rgba(18, 132, 248, 0.32)',
          '&:hover': {
            borderColor: '#1284f8',
            backgroundColor: 'rgba(18, 132, 248, 0.05)',
          },
        },
        text: {
          minHeight: 36,
          paddingInline: 10,
          '&:hover': {
            backgroundColor: 'rgba(18, 132, 248, 0.07)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 8,
          backgroundColor: '#ffffff',
          fontSize: 14,
          transition:
            'background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d7dde5',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#b8c2d0',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1284f8',
            borderWidth: 1,
            boxShadow: '0 0 0 3px rgba(18, 132, 248, 0.12)',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d32f2f',
          },
          '&.MuiInputBase-sizeSmall .MuiOutlinedInput-input': {
            paddingBottom: 9,
            paddingTop: 9,
          },
        },
        input: {
          paddingBottom: 10,
          paddingTop: 10,
          '&::placeholder': {
            color: '#8c8c8c',
            opacity: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          '&.Mui-focused': {
            color: '#1284f8',
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        select: {
          alignItems: 'center',
          display: 'flex',
          minHeight: 22,
          paddingBottom: 9,
          paddingTop: 9,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 14,
          minHeight: 36,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: 12,
          marginLeft: 0,
        },
      },
    },
  },
})
