# Theme Quick Reference Card

Quick access to the most commonly used values from the enhanced theme.

---

## Colors

### Primary (Blue)
```
Main:     #3b82f6
Light:    #60a5fa
Dark:     #2563eb
```

### Success (Green)
```
Main:     #10b981
Light:    #34d399
Dark:     #16a34a
```

### Warning (Orange)
```
Main:     #f59e0b
Light:    #fbbf24
Dark:     #d97706
```

### Error (Red)
```
Main:     #ef4444
Light:    #f87171
Dark:     #dc2626
```

### Purple (Secondary)
```
Main:     #8b5cf6
Light:    #a78bfa
Dark:     #7c3aed
```

### Neutrals
```
Background:    #f9fafb
Paper:         #ffffff
Border:        #e5e7eb
Text Primary:  #111827
Text Secondary:#6b7280
Text Disabled: #9ca3af
```

---

## Spacing (8px base unit)

```
0.5 = 4px
1   = 8px
1.5 = 12px
2   = 16px
2.5 = 20px
3   = 24px
4   = 32px
5   = 40px
6   = 48px
```

**Common Usage**:
```javascript
p: 2      // 16px padding all sides
py: 2.5   // 20px padding vertical
mb: 3     // 24px margin bottom
gap: 1.5  // 12px gap
```

---

## Border Radius

```
Cards/Papers:   8px   (borderRadius: 2)
Buttons/Inputs: 6px   (borderRadius: 1.5)
Dialogs/Modals: 12px
Chips/Badges:   6px   (borderRadius: 1.5)
Circular:       50%
```

**Usage**:
```javascript
sx={{ borderRadius: 2 }}     // Cards
sx={{ borderRadius: 1.5 }}   // Buttons
sx={{ borderRadius: '50%' }} // Circular
```

---

## Shadows

```
Level 1 (xs):   boxShadow: 1  // Subtle
Level 2 (sm):   boxShadow: 2  // Cards (default)
Level 3 (md):   boxShadow: 3  // Hover states
Level 4 (lg):   boxShadow: 4  // Floating elements
Level 5 (xl):   boxShadow: 5  // Modals
```

---

## Font Sizes

```
h1:      40px  (2.5rem)
h2:      32px  (2rem)
h3:      28px  (1.75rem)
h4:      24px  (1.5rem)
h5:      20px  (1.25rem)
h6:      18px  (1.125rem)
body1:   16px  (1rem)
body2:   14px  (0.875rem)
caption: 12px  (0.75rem)
button:  15px  (0.9375rem)
```

**Common Usage**:
```javascript
fontSize: 16  // Section heading
fontSize: 14  // Body text
fontSize: 12  // Supporting text
```

---

## Font Weights

```
300 = Light      (rarely used)
400 = Regular    (body text)
500 = Medium     (labels, buttons)
600 = Semibold   (headings)
700 = Bold       (titles, emphasis)
```

**Usage**:
```javascript
fontWeight: 400  // Body
fontWeight: 500  // Labels
fontWeight: 600  // Headings
fontWeight: 700  // Titles
```

---

## Transitions

```
Duration:
- 150ms: Fastest (hover)
- 200ms: Fast (small elements)
- 300ms: Standard (default)
- 375ms: Complex (large animations)

Easing:
cubic-bezier(0.4, 0, 0.2, 1)  // Standard
```

**Usage**:
```javascript
transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
transition: 'all 0.3s ease'
```

---

## Common Patterns

### Button
```javascript
<Button sx={{
  borderRadius: 1.5,
  px: 3,
  py: 1.25,
  fontWeight: 500
}}>
```

### Card
```javascript
<Card sx={{
  borderRadius: 2,
  border: '1px solid #e5e7eb',
  p: 3,
  boxShadow: 2
}}>
```

### Input
```javascript
<TextField sx={{
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5
  }
}}>
```

### Section Title
```javascript
<Typography
  fontSize={16}
  fontWeight={600}
  color="#111827"
  mb={2}
>
```

### Body Text
```javascript
<Typography
  fontSize={14}
  color="#6b7280"
>
```

---

## Status Colors

### Success
```
Background: #ecfdf5
Border:     #a7f3d0
Text:       #065f46
Icon:       #10b981
```

### Warning
```
Background: #fffbeb
Border:     #fcd34d
Text:       #78350f
Icon:       #f59e0b
```

### Error
```
Background: #fef2f2
Border:     #fecaca
Text:       #991b1b
Icon:       #ef4444
```

### Info
```
Background: #eff6ff
Border:     #bfdbfe
Text:       #1e40af
Icon:       #3b82f6
```

---

## Chip/Badge Variants

### Active
```javascript
bgcolor: '#ecfdf5'
color: '#065f46'
border: '1px solid #a7f3d0'
```

### Pending
```javascript
bgcolor: '#fffbeb'
color: '#78350f'
border: '1px solid #fcd34d'
```

### Inactive
```javascript
bgcolor: '#fef2f2'
color: '#991b1b'
border: '1px solid #fecaca'
```

---

## Gradient Backgrounds

### Blue
```javascript
background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)'
border: '1px solid #bfdbfe'
```

### Green
```javascript
background: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)'
border: '1px solid #a7f3d0'
```

### Orange
```javascript
background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)'
border: '1px solid #fcd34d'
```

### Purple
```javascript
background: 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)'
border: '1px solid #c4b5fd'
```

---

## Icon Sizes

```
Small:   16px
Medium:  20px
Large:   24px
XLarge:  28px
```

**Usage**:
```javascript
<Icon sx={{ fontSize: 20 }} />
```

---

## Common Measurements

### Container Padding
```
Small:  p: 2   (16px)
Medium: p: 2.5 (20px)
Large:  p: 3   (24px)
```

### Section Margins
```
Small:  mb: 2   (16px)
Medium: mb: 2.5 (20px)
Large:  mb: 3   (24px)
```

### Button Padding
```
Small:  py: 0.75, px: 2    (6px, 16px)
Medium: py: 1.25, px: 2.5  (10px, 20px)
Large:  py: 1.5, px: 3     (12px, 24px)
```

### Gap Spacing
```
Tight:  gap: 1   (8px)
Normal: gap: 1.5 (12px)
Loose:  gap: 2   (16px)
XLoose: gap: 3   (24px)
```

---

## Copy-Paste Snippets

### Professional Button
```javascript
<Button variant="contained" sx={{ borderRadius: 1.5, px: 3, py: 1.25 }}>
  Save
</Button>
```

### Card with Border
```javascript
<Card sx={{ borderRadius: 2, border: '1px solid #e5e7eb', p: 3 }}>
  Content
</Card>
```

### Section Header
```javascript
<Typography fontSize={16} fontWeight={600} color="#111827" mb={2}>
  Section Title
</Typography>
```

### Status Chip
```javascript
<Chip
  label="Active"
  size="small"
  sx={{
    bgcolor: '#ecfdf5',
    color: '#065f46',
    border: '1px solid #a7f3d0',
    borderRadius: 1.5,
    fontWeight: 500,
    fontSize: 12
  }}
/>
```

### Alert
```javascript
<Alert
  severity="success"
  sx={{
    borderRadius: 2,
    border: '1px solid #a7f3d0',
    bgcolor: '#ecfdf5',
    color: '#065f46'
  }}
>
  Success message
</Alert>
```

---

## Remember

1. **Spacing**: Always multiples of 8px (0.5, 1, 1.5, 2, 2.5, 3...)
2. **Border Radius**: 6px buttons, 8px cards, 12px modals
3. **Colors**: Use theme colors, not hardcoded values
4. **Font Weights**: 400, 500, 600, 700 only
5. **Transitions**: Include on all interactive elements
6. **Shadows**: Use boxShadow: 1-5, not custom values

---

## Quick Tips

- **Hover States**: Add `transform: 'translateY(-2px)'` and `boxShadow: 3`
- **Active States**: Add `transform: 'translateY(0)'`
- **Focus States**: Use `borderWidth: '2px'` and `borderColor: '#3b82f6'`
- **Disabled States**: Use `opacity: 0.6` or theme disabled colors
- **Loading States**: Use `CircularProgress` with size 18-24px

---

Keep this reference handy for quick lookups while developing!
