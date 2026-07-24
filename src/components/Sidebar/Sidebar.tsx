import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DnsIcon from '@mui/icons-material/Dns';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MemoryIcon from '@mui/icons-material/Memory';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const drawerWidth = 260;

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Pipelines', path: '/pipelines', icon: <DnsIcon /> },
  { label: 'Jobs', path: '/jobs', icon: <ListAltIcon /> },
  { label: 'Logs', path: '/logs', icon: <ReceiptLongIcon /> },
  { label: 'Metrics', path: '/metrics', icon: <MemoryIcon /> },
  { label: 'Reports', path: '/reports', icon: <AssessmentIcon /> },
  { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { pathname } = useLocation();

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={RouterLink}
            to={item.path}
            selected={pathname === item.path}
            onClick={onClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;