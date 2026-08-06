import { Box, Container } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Container maxWidth={false} sx={{ pt: { xs: 10, md: 4 }, pb: 5, pl: { md: '280px !important' }, pr: { md: '32px !important' }, maxWidth: 1600 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default AppLayout;
