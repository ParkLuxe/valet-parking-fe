/**
 * Main App Component
 * Sets up routing and layout for the Park-Luxe application
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ToastProvider, ToastViewport, ToastWithIcon, Layout } from './components';

// Route Components
import { ProtectedRoute, PublicRoute } from './routes';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import QRScanPage from './pages/QRScanPage';
import Analytics from './pages/Analytics';
import HostUserManagement from './pages/HostUserManagement';
import ParkingSlots from './pages/ParkingSlots';
import Subscription from './pages/Subscription';
import Invoices from './pages/Invoices';
import InvoiceDetails from './pages/InvoiceDetails';
import Payments from './pages/Payments';
import SubscriptionPlans from './pages/SubscriptionPlans';
import QRCodeManagement from './pages/QRCodeManagement';
import HostSchedules from './pages/HostSchedules';
import DebugDashboard from './pages/DebugDashboard';

// SuperAdmin Pages
import SubscriptionPlansCRUD from './pages/admin/SubscriptionPlansCRUD';
import HostManagement from './pages/admin/HostManagement';
import SuperAdminAnalytics from './pages/admin/SuperAdminAnalytics';
import SystemSettings from './pages/admin/SystemSettings';
import AllPayments from './pages/admin/AllPayments';

// Host Pages  
import VehicleManagement from './pages/host/VehicleManagement';
import Reports from './pages/host/Reports';

// Valet Pages
import MyVehicles from './pages/valet/MyVehicles';
import MyPerformance from './pages/valet/MyPerformance';

// Redux
import { removeToast } from './redux';
import { USER_ROLES } from './utils';
import { initializeStore } from './utils/initializeStore';
import type { RootState } from './redux';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { toastQueue } = useSelector((state: RootState) => state.notifications);

  // Initialize store with dummy data on mount
  useEffect(() => {
    initializeStore(dispatch);
  }, [dispatch]);

  // Handle toast notifications
  const handleCloseToast = (toastId: string | number) => {
    dispatch(removeToast(toastId));
  };

  return (
    <>
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

          {/* Debug Routes - No auth required for /debug, auth required for /debug-protected */}
          <Route
            path="/debug"
            element={<DebugDashboard />}
          />
          <Route
            path="/debug-protected"
            element={
              <ProtectedRoute>
                <Layout>
                  <DebugDashboard />
                </Layout>
              </ProtectedRoute>
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
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requiredRoles={[USER_ROLES.HOST, USER_ROLES.VALET_HEAD, USER_ROLES.SUPERADMIN]}>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/host-users"
            element={
              <ProtectedRoute requiredRoles={[USER_ROLES.HOST, USER_ROLES.VALET_HEAD]}>
                <Layout>
                  <HostUserManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/parking-slots"
            element={
              <ProtectedRoute requiredRoles={[USER_ROLES.HOST, USER_ROLES.VALET_HEAD, USER_ROLES.VALET]}>
                <Layout>
                  <ParkingSlots />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute requiredRoles={[USER_ROLES.HOST, USER_ROLES.VALET_HEAD]}>
                <Layout>
                  <Subscription />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* New Routes */}
          <Route
            path="/invoices"
            element={
              <ProtectedRoute page="invoices">
                <Layout>
                  <Invoices />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices/:id"
            element={
              <ProtectedRoute page="invoices">
                <Layout>
                  <InvoiceDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute page="payments">
                <Layout>
                  <Payments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription-plans"
            element={
              <ProtectedRoute page="subscriptionPlans">
                <Layout>
                  <SubscriptionPlans />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr-management"
            element={
              <ProtectedRoute page="qrManagement">
                <Layout>
                  <QRCodeManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/host-schedules"
            element={
              <ProtectedRoute page="hostSchedules">
                <Layout>
                  <HostSchedules />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* SuperAdmin Routes */}
          <Route
            path="/subscription-plans-crud"
            element={
              <ProtectedRoute page="subscriptionPlansCRUD">
                <Layout>
                  <SubscriptionPlansCRUD />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/host-management"
            element={
              <ProtectedRoute page="hostManagement">
                <Layout>
                  <HostManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin-analytics"
            element={
              <ProtectedRoute page="superAdminAnalytics">
                <Layout>
                  <SuperAdminAnalytics />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/system-settings"
            element={
              <ProtectedRoute page="systemSettings">
                <Layout>
                  <SystemSettings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-payments"
            element={
              <ProtectedRoute page="allPayments">
                <Layout>
                  <AllPayments />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Host Routes */}
          <Route
            path="/vehicle-management"
            element={
              <ProtectedRoute page="vehicleManagement">
                <Layout>
                  <VehicleManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute page="reports">
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Valet Routes */}
          <Route
            path="/my-vehicles"
            element={
              <ProtectedRoute page="myVehicles">
                <Layout>
                  <MyVehicles />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-performance"
            element={
              <ProtectedRoute page="myPerformance">
                <Layout>
                  <MyPerformance />
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
    </>
  );
};

export default App;
