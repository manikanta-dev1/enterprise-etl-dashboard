import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { AppBar, Avatar, Box, IconButton, Stack, Toolbar, Typography } from '@mui/material';

type NavbarProps = {
  onMenuClick: () => void;
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <AppBar position="fixed" color="inherit" elevation={0} sx={{ display: { md: 'none' }, borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar>
        <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}><Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'primary.main', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 800 }}>F</Box><Typography variant="h6">Flowcast</Typography></Stack>
        <IconButton><NotificationsNoneOutlinedIcon /></IconButton><Avatar sx={{ width: 32, height: 32, ml: 1, bgcolor: '#1B1D29', fontSize: 12 }}>MK</Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
