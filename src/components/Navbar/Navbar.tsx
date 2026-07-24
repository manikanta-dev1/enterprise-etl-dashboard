import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';

type NavbarProps = {
  onMenuClick: () => void;
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <AppBar position="fixed" color="primary" elevation={1}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Enterprise ETL Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;