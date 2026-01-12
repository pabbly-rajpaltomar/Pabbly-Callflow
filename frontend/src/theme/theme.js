import { createTheme } from '@mui/material/styles';

// Light mode palette
const lightPalette = {
  mode: 'light',
  primary: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#8b5cf6',
    light: '#a78bfa',
    dark: '#7c3aed',
    contrastText: '#ffffff',
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#16a34a',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#ffffff',
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    contrastText: '#ffffff',
  },
  info: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f9fafb',
    paper: '#ffffff',
  },
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    disabled: '#9ca3af',
  },
  divider: '#e5e7eb',
  action: {
    active: '#3b82f6',
    hover: 'rgba(59, 130, 246, 0.04)',
    selected: 'rgba(59, 130, 246, 0.08)',
    disabled: '#d1d5db',
    disabledBackground: '#f3f4f6',
    focus: 'rgba(59, 130, 246, 0.12)',
  },
};

// Dark mode palette
const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#60a5fa',
    light: '#93c5fd',
    dark: '#3b82f6',
    contrastText: '#0f172a',
  },
  secondary: {
    main: '#a78bfa',
    light: '#c4b5fd',
    dark: '#8b5cf6',
    contrastText: '#0f172a',
  },
  success: {
    main: '#34d399',
    light: '#6ee7b7',
    dark: '#10b981',
    contrastText: '#0f172a',
  },
  warning: {
    main: '#fbbf24',
    light: '#fcd34d',
    dark: '#f59e0b',
    contrastText: '#0f172a',
  },
  error: {
    main: '#f87171',
    light: '#fca5a5',
    dark: '#ef4444',
    contrastText: '#0f172a',
  },
  info: {
    main: '#60a5fa',
    light: '#93c5fd',
    dark: '#3b82f6',
    contrastText: '#0f172a',
  },
  background: {
    default: '#0f172a',
    paper: '#1e293b',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    disabled: '#64748b',
  },
  divider: '#334155',
  action: {
    active: '#60a5fa',
    hover: 'rgba(96, 165, 250, 0.08)',
    selected: 'rgba(96, 165, 250, 0.16)',
    disabled: '#475569',
    disabledBackground: '#1e293b',
    focus: 'rgba(96, 165, 250, 0.12)',
  },
};

// Get component overrides based on mode
const getComponentOverrides = (mode) => {
  const isDark = mode === 'dark';

  return {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.9375rem',
          padding: '10px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: isDark
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.875rem',
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: isDark
            ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: isDark
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 8,
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: isDark ? '#475569' : '#e5e7eb',
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: isDark ? '#64748b' : '#d1d5db',
            },
            '&.Mui-focused fieldset': {
              borderColor: isDark ? '#60a5fa' : '#3b82f6',
              borderWidth: '2px',
            },
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: isDark
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderRight: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
          boxShadow: 'none',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: isDark
            ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#f1f5f9' : '#111827',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.8125rem',
        },
        filled: {
          border: '1px solid transparent',
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
        },
        head: {
          fontWeight: 600,
          backgroundColor: isDark ? '#0f172a' : '#f9fafb',
          color: isDark ? '#e2e8f0' : '#374151',
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid',
          fontWeight: 400,
        },
        standardSuccess: {
          backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5',
          borderColor: isDark ? 'rgba(52, 211, 153, 0.3)' : '#a7f3d0',
          color: isDark ? '#6ee7b7' : '#065f46',
        },
        standardError: {
          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
          borderColor: isDark ? 'rgba(248, 113, 113, 0.3)' : '#fecaca',
          color: isDark ? '#fca5a5' : '#991b1b',
        },
        standardWarning: {
          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb',
          borderColor: isDark ? 'rgba(251, 191, 36, 0.3)' : '#fcd34d',
          color: isDark ? '#fcd34d' : '#78350f',
        },
        standardInfo: {
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
          borderColor: isDark ? 'rgba(96, 165, 250, 0.3)' : '#bfdbfe',
          color: isDark ? '#93c5fd' : '#1e40af',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: isDark ? '#475569' : '#1f2937',
          fontSize: '0.8125rem',
          fontWeight: 500,
          padding: '8px 12px',
          borderRadius: 6,
        },
        arrow: {
          color: isDark ? '#475569' : '#1f2937',
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          marginTop: 4,
          boxShadow: isDark
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.9375rem',
          padding: '10px 16px',
          borderRadius: 6,
          margin: '2px 8px',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: isDark ? '#334155' : '#f3f4f6',
          },
          '&.Mui-selected': {
            backgroundColor: isDark ? 'rgba(96, 165, 250, 0.16)' : '#eff6ff',
            color: isDark ? '#93c5fd' : '#3b82f6',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(96, 165, 250, 0.24)' : '#dbeafe',
            },
          },
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 44,
          height: 24,
          padding: 0,
        },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            '& + .MuiSwitch-track': {
              backgroundColor: isDark ? '#60a5fa' : '#3b82f6',
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 20,
          height: 20,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        track: {
          borderRadius: 12,
          backgroundColor: isDark ? '#475569' : '#d1d5db',
          opacity: 1,
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
          backgroundColor: isDark ? '#334155' : '#e5e7eb',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: isDark ? '#334155' : '#e5e7eb',
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: isDark ? 'rgba(96, 165, 250, 0.08)' : 'rgba(59, 130, 246, 0.04)',
          },
          '&.Mui-selected': {
            backgroundColor: isDark ? 'rgba(96, 165, 250, 0.16)' : 'rgba(59, 130, 246, 0.08)',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(96, 165, 250, 0.24)' : 'rgba(59, 130, 246, 0.12)',
            },
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: isDark ? 'rgba(96, 165, 250, 0.08)' : 'rgba(59, 130, 246, 0.04)',
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: isDark ? '#60a5fa' : '#3b82f6',
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            color: isDark ? '#60a5fa' : '#3b82f6',
          },
        },
      },
    },
  };
};

// Create theme based on mode
export const getTheme = (mode) => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  return createTheme({
    palette,
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightSemiBold: 600,
      fontWeightBold: 700,
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.35,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.5,
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      subtitle2: {
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.57,
      },
      body1: {
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.57,
      },
      button: {
        fontWeight: 500,
        fontSize: '0.9375rem',
        lineHeight: 1.5,
        textTransform: 'none',
        letterSpacing: '0.01em',
      },
      caption: {
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66,
      },
      overline: {
        fontWeight: 500,
        fontSize: '0.75rem',
        lineHeight: 2,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    shadows: [
      'none',
      '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    ],
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
    components: getComponentOverrides(mode),
  });
};

// Default export for backward compatibility
export default getTheme('light');
