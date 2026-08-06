import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5B5BD6',
      dark: '#4545B5',
    },
    secondary: {
      main: '#10B981',
    },
    background: {
      default: '#F7F8FC',
      paper: '#FFFFFF',
    },
    text: { primary: '#1B1D29', secondary: '#6C7080' },
    divider: '#E8EAF0',
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", "Helvetica Neue", sans-serif',
    h4: { fontWeight: 760, letterSpacing: '-0.035em' },
    h6: { fontWeight: 700, letterSpacing: '-0.015em' },
    button: { textTransform: 'none', fontWeight: 650 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: { styleOverrides: { root: { borderColor: '#E8EAF0', boxShadow: '0 1px 2px rgba(20, 24, 40, .03)' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 9, boxShadow: 'none' } } },
    MuiTableCell: { styleOverrides: { head: { color: '#818598', fontSize: 11, fontWeight: 700, letterSpacing: '.055em', textTransform: 'uppercase', background: '#FAFAFC' }, root: { borderColor: '#EEF0F4' } } },
  },
});
