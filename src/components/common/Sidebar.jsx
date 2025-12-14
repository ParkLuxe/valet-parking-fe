/**
 * Sidebar Navigation Component
 * Role-based navigation menu with drawer functionality
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  QrCodeScanner as QrIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  LocalParking as ParkingIcon,
  Subscriptions as SubscriptionIcon,
  SupervisorAccount as SuperAdminIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import { USER_ROLES } from '../../utils/constants';
import { toggleSidebar } from '../../redux/slices/uiSlice';

const drawerWidth = 260;

// Menu items configuration based on roles
const getMenuItems = (role) => {
  const commonItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/profile', label: 'Profile', icon: <ProfileIcon /> },
  ];

  const hostItems = [
    { path: '/qr-scan', label: 'QR Scan & Entry', icon: <QrIcon /> },
    { path: '/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { path: '/host-users', label: 'Host Users', icon: <PeopleIcon /> },
    { path: '/parking-slots', label: 'Parking Slots', icon: <ParkingIcon /> },
    { path: '/subscription', label: 'Subscription', icon: <SubscriptionIcon /> },
  ];

  const valetItems = [
    { path: '/qr-scan', label: 'QR Scan & Entry', icon: <QrIcon /> },
  ];

  const superAdminItems = [
    { path: '/super-admin', label: 'Super Admin', icon: <SuperAdminIcon /> },
    { path: '/analytics', label: 'All Analytics', icon: <AnalyticsIcon /> },
  ];

  switch (role) {
    case USER_ROLES.SUPER_ADMIN:
      return [...commonItems, ...superAdminItems];
    case USER_ROLES.HOST:
    case USER_ROLES.VALET_HEAD:
      return [...commonItems, ...hostItems];
    case USER_ROLES.VALET:
      return [...commonItems, ...valetItems];
    default:
      return commonItems;
  }
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  const menuItems = getMenuItems(user?.role);

  const handleNavigate = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 900) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transform: sidebarOpen ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
          transition: (theme) =>
            theme.transitions.create('transform', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ParkingIcon color="primary" />
          <Typography variant="h6" color="primary" fontWeight="bold">
            Park-Luxe
          </Typography>
        </Box>
      </Toolbar>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
