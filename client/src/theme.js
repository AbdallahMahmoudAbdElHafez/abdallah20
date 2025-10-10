// client/src/theme/theme.js
import { createTheme } from '@mui/material/styles';

// Define custom color palette
const colors = {
  primary: {
    light: '#42a5f5',
    main: '#1976d2',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },
  secondary: {
    light: '#ff7961',
    main: '#f44336',
    dark: '#ba000d',
    contrastText: '#ffffff',
  },
  success: {
    light: '#81c784',
    main: '#4caf50',
    dark: '#388e3c',
    contrastText: '#ffffff',
  },
  warning: {
    light: '#ffb74d',
    main: '#ff9800',
    dark: '#f57c00',
    contrastText: '#ffffff',
  },
  error: {
    light: '#e57373',
    main: '#f44336',
    dark: '#d32f2f',
    contrastText: '#ffffff',
  },
  info: {
    light: '#64b5f6',
    main: '#2196f3',
    dark: '#1976d2',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

// Create custom theme
const theme = createTheme({
  direction: 'rtl', // Right-to-left support
  palette: {
    mode: 'light',
    ...colors,
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
  },
  
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
  
  shape: {
    borderRadius: 8,
  },
  
  spacing: 8,
  
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.12)',
    '0px 2px 6px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.12)',
    '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.12)',
    '0px 6px 18px rgba(0, 0, 0, 0.08), 0px 6px 12px rgba(0, 0, 0, 0.12)',
    '0px 8px 24px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.12)',
    '0px 12px 32px rgba(0, 0, 0, 0.08), 0px 12px 20px rgba(0, 0, 0, 0.12)',
    '0px 16px 40px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.12)',
    '0px 20px 48px rgba(0, 0, 0, 0.08), 0px 20px 28px rgba(0, 0, 0, 0.12)',
    '0px 24px 56px rgba(0, 0, 0, 0.08), 0px 24px 32px rgba(0, 0, 0, 0.12)',
    '0px 28px 64px rgba(0, 0, 0, 0.08), 0px 28px 36px rgba(0, 0, 0, 0.12)',
    '0px 32px 72px rgba(0, 0, 0, 0.08), 0px 32px 40px rgba(0, 0, 0, 0.12)',
    '0px 36px 80px rgba(0, 0, 0, 0.08), 0px 36px 44px rgba(0, 0, 0, 0.12)',
    '0px 40px 88px rgba(0, 0, 0, 0.08), 0px 40px 48px rgba(0, 0, 0, 0.12)',
    '0px 44px 96px rgba(0, 0, 0, 0.08), 0px 44px 52px rgba(0, 0, 0, 0.12)',
    '0px 48px 104px rgba(0, 0, 0, 0.08), 0px 48px 56px rgba(0, 0, 0, 0.12)',
    '0px 52px 112px rgba(0, 0, 0, 0.08), 0px 52px 60px rgba(0, 0, 0, 0.12)',
    '0px 56px 120px rgba(0, 0, 0, 0.08), 0px 56px 64px rgba(0, 0, 0, 0.12)',
    '0px 60px 128px rgba(0, 0, 0, 0.08), 0px 60px 68px rgba(0, 0, 0, 0.12)',
    '0px 64px 136px rgba(0, 0, 0, 0.08), 0px 64px 72px rgba(0, 0, 0, 0.12)',
    '0px 68px 144px rgba(0, 0, 0, 0.08), 0px 68px 76px rgba(0, 0, 0, 0.12)',
    '0px 72px 152px rgba(0, 0, 0, 0.08), 0px 72px 80px rgba(0, 0, 0, 0.12)',
    '0px 76px 160px rgba(0, 0, 0, 0.08), 0px 76px 84px rgba(0, 0, 0, 0.12)',
    '0px 80px 168px rgba(0, 0, 0, 0.08), 0px 80px 88px rgba(0, 0, 0, 0.12)',
    '0px 84px 176px rgba(0, 0, 0, 0.08), 0px 84px 92px rgba(0, 0, 0, 0.12)',
  ],
  
  components: {
    // Button customizations
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
            boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.3)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        },
        sizeSmall: {
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 12,
          paddingRight: 12,
          fontSize: '0.75rem',
        },
        sizeLarge: {
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 28,
          paddingRight: 28,
          fontSize: '1rem',
        },
      },
    },
    
    // Card customizations
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    
    // Paper customizations
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    
    // Dialog customizations
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    
    // DialogTitle customizations
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 600,
          padding: '24px 24px 16px 24px',
        },
      },
    },
    
    // TextField customizations
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2,
            },
          },
        },
      },
    },
    
    // Chip customizations
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          height: 28,
        },
        sizeSmall: {
          height: 24,
          fontSize: '0.75rem',
        },
      },
    },
    
    // Table customizations
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f8fafc',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'none',
            borderBottom: '2px solid #e2e8f0',
          },
        },
      },
    },
    
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #f1f5f9',
          padding: '12px 16px',
        },
      },
    },
    
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    
    // IconButton customizations
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        },
      },
    },
    
    // AppBar customizations
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        },
      },
    },
    
    // Drawer customizations
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0px 12px 12px 0px',
          border: 'none',
          boxShadow: '4px 0px 16px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    
    // Menu customizations
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          marginTop: 4,
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    
    // MenuItem customizations
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          margin: '2px 8px',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.16)',
            },
          },
        },
      },
    },
    
    // Alert customizations
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid',
        },
        standardError: {
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca',
          color: '#991b1b',
        },
        standardWarning: {
          backgroundColor: '#fffbeb',
          borderColor: '#fed7aa',
          color: '#92400e',
        },
        standardInfo: {
          backgroundColor: '#eff6ff',
          borderColor: '#bfdbfe',
          color: '#1e40af',
        },
        standardSuccess: {
          backgroundColor: '#f0fdf4',
          borderColor: '#bbf7d0',
          color: '#166534',
        },
      },
    },
    
    // Loading/Progress customizations
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#1976d2',
        },
      },
    },
    
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#e2e8f0',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
  },
});

// Custom breakpoints for responsive design
theme.breakpoints.values = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// Custom mixins
theme.mixins = {
  ...theme.mixins,
  // Custom card gradient
  gradientCard: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  },
  // Custom header gradient
  gradientHeader: {
    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
    color: '#ffffff',
  },
  // Custom toolbar
  toolbar: {
    minHeight: 64,
    '@media (min-width:600px)': {
      minHeight: 64,
    },
  },
};

export default theme;