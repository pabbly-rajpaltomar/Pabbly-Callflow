# Professional UI Component Patterns

## Ready-to-Use Component Snippets

This guide provides copy-paste ready code snippets for common UI patterns that match the enhanced theme perfectly.

---

## 1. Stat Cards

### Gradient Stat Card with Icon

```javascript
<Paper sx={{
  p: 2.5,
  borderRadius: 2,
  background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
  border: '1px solid #bfdbfe',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: 3,
    transform: 'translateY(-2px)'
  }
}}>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box>
      <Typography fontSize={12} color="#1e40af" fontWeight={500} mb={1}>
        TOTAL USERS
      </Typography>
      <Typography variant="h4" fontWeight={700} color="#1e3a8a">
        1,234
      </Typography>
    </Box>
    <Box sx={{
      width: 48,
      height: 48,
      borderRadius: '50%',
      bgcolor: '#2563eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
    }}>
      <Icon sx={{ color: 'white', fontSize: 22 }} />
    </Box>
  </Box>
</Paper>
```

### Color Variants

**Success (Green)**:
```javascript
background: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)'
border: '1px solid #a7f3d0'
label color: '#047857'
value color: '#065f46'
icon bg: '#16a34a'
```

**Warning (Orange)**:
```javascript
background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)'
border: '1px solid #fcd34d'
label color: '#92400e'
value color: '#78350f'
icon bg: '#f59e0b'
```

**Error (Red)**:
```javascript
background: 'linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%)'
border: '1px solid #fecaca'
label color: '#991b1b'
value color: '#7f1d1d'
icon bg: '#dc2626'
```

**Purple**:
```javascript
background: 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)'
border: '1px solid #c4b5fd'
label color: '#6d28d9'
value color: '#5b21b6'
icon bg: '#7c3aed'
```

---

## 2. Action Buttons

### Primary Action Button

```javascript
<Button
  variant="contained"
  startIcon={<SaveIcon />}
  sx={{
    borderRadius: 1.5,
    px: 3,
    py: 1.25,
    fontWeight: 500,
    fontSize: '0.9375rem',
    boxShadow: 1,
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: 3,
      transform: 'translateY(-1px)'
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  }}
>
  Save Changes
</Button>
```

### Secondary/Cancel Button

```javascript
<Button
  variant="outlined"
  sx={{
    borderRadius: 1.5,
    px: 3,
    py: 1.25,
    fontWeight: 500,
    fontSize: '0.9375rem',
    borderWidth: '1.5px',
    borderColor: '#e5e7eb',
    color: '#374151',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderWidth: '1.5px',
      borderColor: '#d1d5db',
      bgcolor: '#f9fafb'
    }
  }}
>
  Cancel
</Button>
```

### Button Group

```javascript
<Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 3 }}>
  <Button
    variant="outlined"
    sx={{
      borderRadius: 1.5,
      borderColor: '#e5e7eb',
      color: '#374151',
      '&:hover': { borderColor: '#d1d5db', bgcolor: '#f9fafb' }
    }}
  >
    Cancel
  </Button>
  <Button
    variant="contained"
    sx={{
      borderRadius: 1.5,
      boxShadow: 1,
      '&:hover': { boxShadow: 3, transform: 'translateY(-1px)' }
    }}
  >
    Save
  </Button>
</Box>
```

---

## 3. Form Fields

### Professional Text Input

```javascript
<TextField
  fullWidth
  label="Email Address"
  placeholder="you@example.com"
  sx={{
    mb: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      transition: 'all 0.2s ease',
      '& fieldset': {
        borderColor: '#e5e7eb',
        borderWidth: '1.5px'
      },
      '&:hover fieldset': {
        borderColor: '#d1d5db'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3b82f6',
        borderWidth: '2px'
      }
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
      color: '#6b7280',
      '&.Mui-focused': {
        color: '#3b82f6',
        fontWeight: 500
      }
    }
  }}
/>
```

### Select Dropdown

```javascript
<FormControl fullWidth sx={{ mb: 2 }}>
  <InputLabel sx={{ fontWeight: 500, color: '#6b7280' }}>
    Category
  </InputLabel>
  <Select
    label="Category"
    sx={{
      borderRadius: 1.5,
      '& fieldset': {
        borderColor: '#e5e7eb',
        borderWidth: '1.5px'
      },
      '&:hover fieldset': {
        borderColor: '#d1d5db'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3b82f6',
        borderWidth: '2px'
      }
    }}
  >
    <MenuItem value="option1">Option 1</MenuItem>
    <MenuItem value="option2">Option 2</MenuItem>
  </Select>
</FormControl>
```

---

## 4. Cards

### Professional Card

```javascript
<Card sx={{
  borderRadius: 2,
  border: '1px solid #e5e7eb',
  boxShadow: 2,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: 3,
    transform: 'translateY(-2px)'
  }
}}>
  <CardContent sx={{ p: 3 }}>
    <Typography fontSize={16} fontWeight={600} color="#111827" mb={2}>
      Card Title
    </Typography>
    <Typography fontSize={14} color="#6b7280" lineHeight={1.6}>
      Card content goes here with proper spacing and colors.
    </Typography>
  </CardContent>
</Card>
```

### Card with Header and Actions

```javascript
<Card sx={{
  borderRadius: 2,
  border: '1px solid #e5e7eb',
  boxShadow: 2
}}>
  <Box sx={{
    p: 2.5,
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{
        width: 40,
        height: 40,
        borderRadius: 1.5,
        bgcolor: '#eff6ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon sx={{ color: '#3b82f6', fontSize: 20 }} />
      </Box>
      <Typography fontSize={16} fontWeight={600} color="#111827">
        Section Title
      </Typography>
    </Box>
    <IconButton size="small">
      <MoreVertIcon fontSize="small" />
    </IconButton>
  </Box>
  <CardContent sx={{ p: 3 }}>
    Content here
  </CardContent>
</Card>
```

---

## 5. Tables

### Professional Table

```javascript
<TableContainer component={Paper} sx={{
  borderRadius: 2,
  border: '1px solid #e5e7eb',
  boxShadow: 2
}}>
  <Table>
    <TableHead>
      <TableRow sx={{ bgcolor: '#f9fafb' }}>
        <TableCell sx={{
          fontWeight: 600,
          color: '#374151',
          fontSize: 13,
          py: 1.75,
          borderBottom: '1px solid #e5e7eb'
        }}>
          Name
        </TableCell>
        <TableCell sx={{
          fontWeight: 600,
          color: '#374151',
          fontSize: 13,
          py: 1.75,
          borderBottom: '1px solid #e5e7eb'
        }}>
          Email
        </TableCell>
        <TableCell sx={{
          fontWeight: 600,
          color: '#374151',
          fontSize: 13,
          py: 1.75,
          borderBottom: '1px solid #e5e7eb'
        }}>
          Status
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow sx={{
        transition: 'background-color 0.15s ease',
        '&:hover': { bgcolor: '#f9fafb' }
      }}>
        <TableCell sx={{
          py: 2,
          fontSize: 14,
          color: '#111827',
          borderBottom: '1px solid #e5e7eb'
        }}>
          John Doe
        </TableCell>
        <TableCell sx={{
          py: 2,
          fontSize: 14,
          color: '#6b7280',
          borderBottom: '1px solid #e5e7eb'
        }}>
          john@example.com
        </TableCell>
        <TableCell sx={{
          py: 2,
          borderBottom: '1px solid #e5e7eb'
        }}>
          <Chip
            label="Active"
            size="small"
            sx={{
              bgcolor: '#ecfdf5',
              color: '#065f46',
              fontWeight: 500,
              fontSize: 12,
              borderRadius: 1.5,
              border: '1px solid #a7f3d0'
            }}
          />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
```

---

## 6. Dialogs/Modals

### Professional Dialog

```javascript
<Dialog
  open={open}
  onClose={handleClose}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: '12px',
      boxShadow: 5
    }
  }}
>
  <DialogTitle sx={{
    borderBottom: '1px solid #e5e7eb',
    p: 3
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{
        width: 40,
        height: 40,
        borderRadius: 1.5,
        bgcolor: '#eff6ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon sx={{ color: '#3b82f6', fontSize: 20 }} />
      </Box>
      <Typography fontSize={18} fontWeight={600} color="#111827">
        Dialog Title
      </Typography>
    </Box>
  </DialogTitle>

  <DialogContent sx={{ p: 3 }}>
    <Typography fontSize={14} color="#6b7280" mb={2.5}>
      Dialog description or instructions go here.
    </Typography>
    {/* Form fields or content */}
  </DialogContent>

  <DialogActions sx={{
    borderTop: '1px solid #e5e7eb',
    p: 3,
    gap: 1.5
  }}>
    <Button
      onClick={handleClose}
      variant="outlined"
      sx={{
        borderRadius: 1.5,
        borderColor: '#e5e7eb',
        color: '#374151'
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={handleSubmit}
      variant="contained"
      sx={{
        borderRadius: 1.5,
        boxShadow: 1
      }}
    >
      Confirm
    </Button>
  </DialogActions>
</Dialog>
```

---

## 7. Alerts & Notifications

### Success Alert

```javascript
<Alert
  severity="success"
  sx={{
    borderRadius: 2,
    border: '1px solid #a7f3d0',
    bgcolor: '#ecfdf5',
    color: '#065f46',
    fontSize: 14,
    fontWeight: 400,
    '& .MuiAlert-icon': {
      color: '#10b981'
    }
  }}
>
  Operation completed successfully!
</Alert>
```

### Error Alert

```javascript
<Alert
  severity="error"
  sx={{
    borderRadius: 2,
    border: '1px solid #fecaca',
    bgcolor: '#fef2f2',
    color: '#991b1b',
    fontSize: 14,
    fontWeight: 400,
    '& .MuiAlert-icon': {
      color: '#ef4444'
    }
  }}
>
  An error occurred. Please try again.
</Alert>
```

### Warning Alert

```javascript
<Alert
  severity="warning"
  sx={{
    borderRadius: 2,
    border: '1px solid #fcd34d',
    bgcolor: '#fffbeb',
    color: '#78350f',
    fontSize: 14,
    fontWeight: 400,
    '& .MuiAlert-icon': {
      color: '#f59e0b'
    }
  }}
>
  Please review the information before proceeding.
</Alert>
```

### Info Alert

```javascript
<Alert
  severity="info"
  sx={{
    borderRadius: 2,
    border: '1px solid #bfdbfe',
    bgcolor: '#eff6ff',
    color: '#1e40af',
    fontSize: 14,
    fontWeight: 400,
    '& .MuiAlert-icon': {
      color: '#3b82f6'
    }
  }}
>
  This is an informational message.
</Alert>
```

---

## 8. Chips & Badges

### Status Chips

**Active/Success**:
```javascript
<Chip
  label="Active"
  size="small"
  sx={{
    bgcolor: '#ecfdf5',
    color: '#065f46',
    fontWeight: 500,
    fontSize: 12,
    borderRadius: 1.5,
    border: '1px solid #a7f3d0',
    height: 24
  }}
/>
```

**Pending/Warning**:
```javascript
<Chip
  label="Pending"
  size="small"
  sx={{
    bgcolor: '#fffbeb',
    color: '#78350f',
    fontWeight: 500,
    fontSize: 12,
    borderRadius: 1.5,
    border: '1px solid #fcd34d',
    height: 24
  }}
/>
```

**Inactive/Error**:
```javascript
<Chip
  label="Inactive"
  size="small"
  sx={{
    bgcolor: '#fef2f2',
    color: '#991b1b',
    fontWeight: 500,
    fontSize: 12,
    borderRadius: 1.5,
    border: '1px solid #fecaca',
    height: 24
  }}
/>
```

---

## 9. Loading States

### Full Page Loading

```javascript
{loading && (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    gap: 2
  }}>
    <CircularProgress size={48} thickness={4} sx={{ color: '#3b82f6' }} />
    <Typography fontSize={14} color="#6b7280" fontWeight={500}>
      Loading...
    </Typography>
  </Box>
)}
```

### Loading Button

```javascript
<Button
  variant="contained"
  disabled={loading}
  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
  sx={{
    borderRadius: 1.5,
    px: 3,
    py: 1.25
  }}
>
  {loading ? 'Saving...' : 'Save Changes'}
</Button>
```

### Skeleton Loading

```javascript
<Card sx={{ p: 3, borderRadius: 2, border: '1px solid #e5e7eb' }}>
  <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1.5 }} />
  <Skeleton variant="text" width="100%" height={20} />
  <Skeleton variant="text" width="90%" height={20} />
  <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2, borderRadius: 2 }} />
</Card>
```

---

## 10. Empty States

### Professional Empty State

```javascript
<Box sx={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  py: 8,
  px: 3
}}>
  <Box sx={{
    width: 80,
    height: 80,
    borderRadius: '50%',
    bgcolor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mb: 3
  }}>
    <Icon sx={{ fontSize: 40, color: '#9ca3af' }} />
  </Box>
  <Typography fontSize={18} fontWeight={600} color="#111827" mb={1}>
    No Items Found
  </Typography>
  <Typography fontSize={14} color="#6b7280" textAlign="center" maxWidth={400} mb={3}>
    Get started by creating your first item. It only takes a few seconds.
  </Typography>
  <Button
    variant="contained"
    startIcon={<AddIcon />}
    sx={{
      borderRadius: 1.5,
      px: 3,
      py: 1.25
    }}
  >
    Create New Item
  </Button>
</Box>
```

---

## 11. Search & Filter Bar

### Professional Search Bar

```javascript
<Box sx={{
  display: 'flex',
  gap: 2,
  mb: 3,
  flexWrap: 'wrap',
  alignItems: 'center'
}}>
  <TextField
    placeholder="Search..."
    size="small"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
        </InputAdornment>
      )
    }}
    sx={{
      flex: 1,
      minWidth: 250,
      '& .MuiOutlinedInput-root': {
        borderRadius: 1.5,
        bgcolor: 'white',
        '& fieldset': {
          borderColor: '#e5e7eb',
          borderWidth: '1.5px'
        },
        '&:hover fieldset': {
          borderColor: '#d1d5db'
        },
        '&.Mui-focused fieldset': {
          borderColor: '#3b82f6',
          borderWidth: '2px'
        }
      }
    }}
  />
  <Button
    variant="outlined"
    startIcon={<FilterIcon />}
    sx={{
      borderRadius: 1.5,
      borderColor: '#e5e7eb',
      color: '#374151',
      '&:hover': {
        borderColor: '#d1d5db',
        bgcolor: '#f9fafb'
      }
    }}
  >
    Filters
  </Button>
</Box>
```

---

## 12. Pagination

### Professional Pagination

```javascript
<Box sx={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mt: 3,
  pt: 3,
  borderTop: '1px solid #e5e7eb'
}}>
  <Typography fontSize={14} color="#6b7280">
    Showing <strong>1-10</strong> of <strong>100</strong> results
  </Typography>
  <Pagination
    count={10}
    shape="rounded"
    sx={{
      '& .MuiPaginationItem-root': {
        borderRadius: 1.5,
        fontWeight: 500,
        fontSize: 14,
        color: '#374151',
        '&:hover': {
          bgcolor: '#f3f4f6'
        },
        '&.Mui-selected': {
          bgcolor: '#3b82f6',
          color: 'white',
          '&:hover': {
            bgcolor: '#2563eb'
          }
        }
      }
    }}
  />
</Box>
```

---

## Usage Tips

1. **Copy the pattern you need** and adjust values as needed
2. **Maintain consistency** by using the same patterns throughout your app
3. **Use spacing multipliers** (0.5, 1, 1.5, 2, 2.5, 3, etc.)
4. **Stick to the color palette** defined in the theme
5. **Add transitions** for smooth interactions
6. **Test responsiveness** on different screen sizes

All patterns follow the enhanced theme guidelines with:
- Consistent 8px spacing increments
- Professional color palette
- Proper border radius (6px buttons, 8px cards, 12px dialogs)
- Smooth transitions
- Accessible color contrasts
- Professional shadows
