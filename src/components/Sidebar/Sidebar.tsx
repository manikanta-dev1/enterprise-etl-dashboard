import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DnsIcon from '@mui/icons-material/Dns';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MemoryIcon from '@mui/icons-material/Memory';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
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
      variant={open ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: open ? 'block' : 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #E8EAF0',
          background: '#FFFFFF',
        },
      }}
    >
      <Toolbar sx={{ minHeight: '76px !important', px: 2.5 }}><Stack direction="row" alignItems="center" spacing={1.25}><Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: 'primary.main', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 800, boxShadow: '0 8px 18px rgba(91,91,214,.22)' }}>F</Box><Box><Typography fontWeight={800} lineHeight={1.1}>Flowcast</Typography><Typography variant="caption" color="text.secondary">Data operations</Typography></Box></Stack></Toolbar>
      <Divider />
      <Typography variant="caption" sx={{ px: 2.5, pt: 2.5, pb: 1, color: 'text.secondary', fontWeight: 700, letterSpacing: '.08em' }}>WORKSPACE</Typography>
      <List sx={{ px: 1.5, py: 0 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={RouterLink}
            to={item.path}
            selected={pathname === item.path}
            onClick={onClose}
            sx={{ borderRadius: 2, mb: .5, minHeight: 44, color: 'text.secondary', '&.Mui-selected': { bgcolor: '#F0F0FF', color: 'primary.main', '&:hover': { bgcolor: '#EAEAFF' } }, '& .MuiListItemIcon-root': { minWidth: 38, color: 'inherit' } }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}><Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: '#F7F8FC' }}><Stack direction="row" spacing={1.25} alignItems="center"><Avatar sx={{ width: 36, height: 36, bgcolor: '#1B1D29', fontSize: 12 }}>MK</Avatar><Box sx={{ minWidth: 0 }}><Typography variant="body2" fontWeight={700} noWrap>Manikanta</Typography><Typography variant="caption" color="text.secondary" noWrap>Workspace admin</Typography></Box></Stack></Box></Box>
    </Drawer>
  );
};

export default Sidebar;
