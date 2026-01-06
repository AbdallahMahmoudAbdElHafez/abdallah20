import { createTheme } from '@mui/material/styles';

const getPalette = (mode) => {
  switch (mode) {
    case 'dark':
      return {
        mode: 'dark',
        primary: {
          main: '#fbbf24', // Amber/Gold
          light: '#fcd34d',
          dark: '#d97706',
          contrastText: '#1e293b',
        },
        secondary: {
          main: '#60a5fa', // Blue
          light: '#93c5fd',
          dark: '#2563eb',
        },
        background: {
          default: '#0f172a', // Deep navy
          paper: '#1e293b', // Slate blue
        },
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
        },
        divider: 'rgba(148, 163, 184, 0.1)',
      };
    case 'emerald':
      return {
        mode: 'light',
        primary: {
          main: '#059669', // Emerald
          light: '#34d399',
          dark: '#047857',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#f59e0b', // Amber
          light: '#fbbf24',
          dark: '#d97706',
        },
        background: {
          default: '#f0fdf4', // Very light green
          paper: '#ffffff',
        },
        text: {
          primary: '#064e3b',
          secondary: '#065f46',
        },
        divider: '#d1fae5',
      };
    case 'royal':
      return {
        mode: 'light',
        primary: {
          main: '#7c3aed', // Violet
          light: '#a78bfa',
          dark: '#5b21b6',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#db2777', // Rose
          light: '#f472b6',
          dark: '#9d174d',
        },
        background: {
          default: '#f5f3ff', // Very light violet
          paper: '#ffffff',
        },
        text: {
          primary: '#2e1065',
          secondary: '#4c1d95',
        },
        divider: '#ede9fe',
      };
    case 'light':
    default:
      return {
        mode: 'light',
        primary: {
          main: '#1d4ed8', // Royal Blue
          light: '#3b82f6',
          dark: '#1e40af',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#f43f5e', // Rose
          light: '#fb7185',
          dark: '#be123c',
        },
        background: {
          default: '#f8fafc',
          paper: '#ffffff',
        },
        text: {
          primary: '#0f172a',
          secondary: '#475569',
        },
        divider: '#f1f5f9',
      };
  }
};

export const createAppTheme = (config) => {
  const { themeName, primaryColor, borderRadius, fontFamily } = config;
  const palette = getPalette(themeName);

  // Override primary color if provided
  if (primaryColor) {
    palette.primary = {
      main: primaryColor,
      light: primaryColor + 'cc',
      dark: primaryColor + 'ee',
      contrastText: '#ffffff',
    };
  }

  return createTheme({
    direction: 'rtl',
    palette,
    typography: {
      fontFamily: `"${fontFamily}", "Inter", "Tajawal", "Roboto", "Helvetica", "Arial", sans-serif`,
      h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em' },
      h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.025em' },
      h3: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.025em' },
      h4: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.025em' },
      h5: { fontSize: '1.25rem', fontWeight: 600 },
      h6: { fontSize: '1.125rem', fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: {
      borderRadius: borderRadius || 12,
    },
    shadows: [
      'none',
      '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      ...Array(19).fill('none') // Fill remaining shadows
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: palette.mode === 'dark' ? '#334155 #0f172a' : '#cbd5e1 #f8fafc',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: palette.background.default,
            },
            '&::-webkit-scrollbar-thumb': {
              background: palette.mode === 'dark' ? '#334155' : '#cbd5e1',
              borderRadius: '10px',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: (borderRadius || 12) - 2,
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            fontFamily: `"${fontFamily}", "Tajawal", sans-serif`,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: (borderRadius || 12) + 4,
            backgroundImage: 'none',
            backdropFilter: 'blur(8px)',
            backgroundColor: palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
            border: `1px solid ${palette.divider}`,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius || 16,
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: borderRadius || 10,
              backgroundColor: palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.5)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(241, 245, 249, 0.8)',
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            backdropFilter: 'blur(12px)',
            boxShadow: 'none',
            borderBottom: `1px solid ${palette.divider}`,
            color: palette.text.primary,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: 'none',
            backgroundColor: palette.mode === 'dark' ? '#0f172a' : '#ffffff',
            boxShadow: palette.mode === 'dark' ? '10px 0 15px -3px rgba(0, 0, 0, 0.4)' : '10px 0 15px -3px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
  });
};

export default createAppTheme({ themeName: 'light', borderRadius: 12, fontFamily: 'Tajawal' });
