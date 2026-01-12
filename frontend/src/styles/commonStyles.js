// Common styles for consistent UI across all pages

export const pageStyles = {
  // Page title
  pageTitle: {
    variant: 'h5',
    fontWeight: 600,
    color: '#111827',
    mb: 2
  },

  // Stats card - compact
  statsCard: {
    p: 1.5,
    borderRadius: 1.5,
    height: '100%'
  },

  // Stats card container
  statsContainer: {
    display: 'grid',
    gap: 1.5,
    mb: 2
  },

  // Stats number
  statsNumber: {
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.2
  },

  // Stats label
  statsLabel: {
    fontSize: 11,
    fontWeight: 500
  },

  // Stats icon avatar
  statsAvatar: {
    width: 30,
    height: 30
  },

  // Paper/Card container
  paper: {
    borderRadius: 2,
    border: '1px solid #e5e7eb',
    overflow: 'hidden'
  },

  // Table header
  tableHeader: {
    bgcolor: '#f9fafb',
    '& .MuiTableCell-head': {
      fontWeight: 600,
      color: '#4b5563',
      fontSize: 13,
      py: 1.5
    }
  },

  // Table row
  tableRow: {
    '&:hover': { bgcolor: '#f9fafb' },
    '& .MuiTableCell-body': {
      py: 1.5,
      fontSize: 13
    }
  },

  // Button styles
  primaryButton: {
    borderRadius: 1.5,
    textTransform: 'none',
    fontWeight: 500,
    px: 2,
    py: 0.75
  },

  outlinedButton: {
    borderRadius: 1.5,
    textTransform: 'none',
    borderColor: '#e5e7eb',
    color: '#374151',
    fontWeight: 500,
    px: 2,
    py: 0.75
  },

  // Search field
  searchField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      bgcolor: '#f9fafb',
      fontSize: 13,
      '& fieldset': { borderColor: '#e5e7eb' }
    }
  },

  // Dialog
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 2
    }
  },

  dialogTitle: {
    fontWeight: 600,
    fontSize: 18,
    borderBottom: '1px solid #e5e7eb',
    py: 2,
    px: 2.5
  },

  dialogContent: {
    py: 2.5,
    px: 2.5
  },

  dialogActions: {
    px: 2.5,
    py: 2,
    borderTop: '1px solid #e5e7eb'
  },

  // Chip styles
  chip: {
    height: 22,
    fontSize: '0.75rem',
    fontWeight: 500
  },

  // Section header
  sectionHeader: {
    p: 2,
    borderBottom: '1px solid #e5e7eb'
  },

  // Tabs
  tabs: {
    px: 2,
    '& .MuiTab-root': {
      textTransform: 'none',
      minHeight: 44,
      fontWeight: 500,
      fontSize: 13
    },
    '& .Mui-selected': { color: '#1a1a1a' },
    '& .MuiTabs-indicator': { backgroundColor: '#1a1a1a', height: 2 }
  },

  // Icon button
  iconButton: {
    width: 32,
    height: 32
  },

  // Alert
  alert: {
    mb: 2,
    borderRadius: 1.5
  }
};

// Stats card color themes
export const statsThemes = {
  green: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    border: '1px solid #a5d6a7',
    labelColor: '#2e7d32',
    numberColor: '#1b5e20',
    iconBg: '#4caf50'
  },
  blue: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    border: '1px solid #90caf9',
    labelColor: '#1565c0',
    numberColor: '#0d47a1',
    iconBg: '#2196f3'
  },
  orange: {
    background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
    border: '1px solid #ffe082',
    labelColor: '#f57c00',
    numberColor: '#e65100',
    iconBg: '#ff9800'
  },
  purple: {
    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    border: '1px solid #ce93d8',
    labelColor: '#7b1fa2',
    numberColor: '#4a148c',
    iconBg: '#9c27b0'
  },
  red: {
    background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
    border: '1px solid #ef9a9a',
    labelColor: '#c62828',
    numberColor: '#b71c1c',
    iconBg: '#f44336'
  },
  teal: {
    background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
    border: '1px solid #80cbc4',
    labelColor: '#00796b',
    numberColor: '#004d40',
    iconBg: '#009688'
  }
};

export default pageStyles;
