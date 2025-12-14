/**
 * Main Layout Component
 * Includes sidebar, header, and main content area
 */

import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: '100%',
          minHeight: '100vh',
        }}
      >
        <Toolbar /> {/* Spacer for fixed header */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
