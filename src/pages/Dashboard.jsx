/**
 * Dashboard Page
 * Main dashboard showing metrics and recent activity
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Timer as TimerIcon,
  LocalShipping as DeliveryIcon,
} from '@mui/icons-material';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { setMetrics } from '../redux/slices/analyticsSlice';
import { formatDuration } from '../utils/helpers';

// Metric Card Component
const MetricCard = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          bgcolor: `${color}.light`,
          p: 2,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon, { 
          sx: { fontSize: 40, color: `${color}.main` } 
        })}
      </Box>
    </Box>
  </Card>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { metrics, loading } = useSelector((state) => state.analytics);
  const { activeVehicles } = useSelector((state) => state.vehicles);

  useEffect(() => {
    // Fetch dashboard metrics
    // TODO: Replace with actual API call
    dispatch(setMetrics({
      activeValets: 5,
      carsParked: 12,
      avgParkingTime: 8,
      avgDeliveryTime: 5,
    }));
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening with your valet parking today.
      </Typography>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Valets"
            value={metrics.activeValets}
            icon={<PersonIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Cars Currently Parked"
            value={metrics.carsParked}
            icon={<CarIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Avg Parking Time"
            value={formatDuration(metrics.avgParkingTime)}
            icon={<TimerIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Avg Delivery Time"
            value={formatDuration(metrics.avgDeliveryTime)}
            icon={<DeliveryIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card title="Recent Activity">
            {activeVehicles.length > 0 ? (
              <Box>
                {activeVehicles.slice(0, 5).map((vehicle) => (
                  <Box
                    key={vehicle.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: '1px solid #eee',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {vehicle.vehicleNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.valetName} • Slot {vehicle.parkingSlot}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        bgcolor: 'success.light',
                        color: 'success.dark',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="caption" fontWeight="medium">
                        {vehicle.status}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No recent activity
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card title="Quick Stats">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Vehicles Today
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  24
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Revenue Today
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  ₹2,400
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Available Slots
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  8 / 20
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
