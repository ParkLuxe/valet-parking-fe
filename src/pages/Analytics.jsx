/**
 * Analytics Dashboard Page
 * Displays metrics, valet performance, and recent activity
 */

import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import Card from '../components/common/Card';

const Analytics = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Detailed analytics and performance metrics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card title="Valet Performance">
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Performance charts and metrics will be displayed here
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card title="Recent Activity">
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Live activity feed will be displayed here
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;
