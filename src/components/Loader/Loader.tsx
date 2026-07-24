import { Box, CircularProgress } from '@mui/material';

const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
    <CircularProgress />
  </Box>
);

export default Loader;