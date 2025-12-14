/**
 * Main App Component
 * Sets up routing and layout for the Park-Luxe application
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { ToastProvider, ToastViewport, ToastWithIcon } from './components/common/Toast';

// Route Components
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Layout from './components/common/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import QRScanPage from './pages/QRScanPage';

// Redux
import { removeToast } from './redux/slices/notificationSlice';
import { USER_ROLES } from './utils/constants';
import { initializeStore } from './utils/initializeStore';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const dispatch = useDispatch();
  const { toastQueue } = useSelector((state) => state.notifications);

  // Initialize store with dummy data on mount
  useEffect(() => {
    initializeStore(dispatch);
  }, [dispatch]);

  // Handle toast notifications
  const handleCloseToast = (toastId) => {
    dispatch(removeToast(toastId));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr-scan"
            element={
              <ProtectedRoute requiredRoles={[USER_ROLES.HOST, USER_ROLES.VALET_HEAD, USER_ROLES.VALET]}>
                <Layout>
                  <QRScanPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>

      {/* Toast Notifications using Radix UI */}
      <ToastProvider>
        {toastQueue.map((toast) => (
          <ToastWithIcon
            key={toast.id}
            variant={toast.type || 'info'}
            title={toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}
            description={toast.message}
            onClose={() => handleCloseToast(toast.id)}
          />
        ))}
        <ToastViewport />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
