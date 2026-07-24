import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#0A6E7A',
    },
    secondary: {
      main: '#E67E22',
    },
    background: {
      default: '#F4F7F8',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
});