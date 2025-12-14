/**
 * Subscription Management Page
 * View subscription status, usage, and payment history
 */

import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/helpers';
import { SUBSCRIPTION } from '../utils/constants';

const Subscription = () => {
  const { status, usage, billing, paymentHistory } = useSelector((state) => state.subscription);

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'success';
      case 'grace_period':
        return 'warning';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const usagePercentage = (usage.usedScans / usage.totalScans) * 100;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Subscription Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your subscription and view billing information
      </Typography>

      <Grid container spacing={3}>
        {/* Subscription Status */}
        <Grid item xs={12} md={6}>
          <Card title="Subscription Status">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Current Status
                </Typography>
                <Chip
                  label={status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor()}
                  sx={{ mt: 1 }}
                />
              </Box>

              <Divider />

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Scan Usage
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {usage.usedScans}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / {usage.totalScans} scans
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(usagePercentage, 100)}
                  color={status === 'active' ? 'primary' : 'warning'}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>

              {status === 'grace_period' && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'warning.light',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="warning.dark">
                    ⚠️ Grace Period Active: You have exceeded your scan limit. Please make a payment to continue service.
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        {/* Billing Info */}
        <Grid item xs={12} md={6}>
          <Card title="Billing Information">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Base Plan
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formatCurrency(SUBSCRIPTION.BASE_PRICE)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Includes {SUBSCRIPTION.BASE_SCANS} scans
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Additional Scans
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatCurrency(SUBSCRIPTION.ADDITIONAL_SCAN_PRICE)} per scan
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Current Amount Due
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {formatCurrency(billing.currentAmount)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                startIcon={<PaymentIcon />}
                fullWidth
              >
                Pay Now with Razorpay
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Payment History */}
        <Grid item xs={12}>
          <Card title="Payment History">
            {paymentHistory.length > 0 ? (
              <Box>
                {paymentHistory.map((payment, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: index < paymentHistory.length - 1 ? '1px solid #eee' : 'none',
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Payment #{payment.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(payment.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {formatCurrency(payment.amount)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No payment history available
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Subscription;
