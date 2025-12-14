/**
 * QR Scan & Customer Details Entry Page
 * Dynamic QR code display, customer details form, and vehicle management
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Box,
  Typography,
  MenuItem,
  Alert,
} from '@mui/material';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { addVehicle } from '../redux/slices/vehicleSlice';
import { addToast } from '../redux/slices/notificationSlice';
import { incrementScanCount } from '../redux/slices/subscriptionSlice';
import vehicleService from '../services/vehicleService';
import { VEHICLE_TYPES } from '../utils/constants';
import {
  validateVehicleNumber,
  validatePhone,
  validateRequired,
} from '../utils/validators';

const QRScanPage = () => {
  const dispatch = useDispatch();
  const { slots } = useSelector((state) => state.parkingSlots);
  const { valetList } = useSelector((state) => state.valets);
  const { status: subscriptionStatus, usage } = useSelector((state) => state.subscription);
  
  const [qrValue, setQrValue] = useState('');
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'car',
    vehicleColor: '',
    customerPhone: '',
    customerName: '',
    parkingSlotId: '',
    valetId: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const generateQRCode = React.useCallback(() => {
    const newQRValue = `PARK-LUXE-${Date.now()}`;
    setQrValue(newQRValue);
  }, []);

  // Generate new QR code every 30 seconds
  useEffect(() => {
    generateQRCode();
    const interval = setInterval(generateQRCode, 30000);
    return () => clearInterval(interval);
  }, [generateQRCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    const vehicleNumberValidation = validateVehicleNumber(formData.vehicleNumber);
    if (!vehicleNumberValidation.isValid) {
      newErrors.vehicleNumber = vehicleNumberValidation.error;
    }
    
    const phoneValidation = validatePhone(formData.customerPhone);
    if (!phoneValidation.isValid) {
      newErrors.customerPhone = phoneValidation.error;
    }
    
    const nameValidation = validateRequired(formData.customerName, 'Customer Name');
    if (!nameValidation.isValid) {
      newErrors.customerName = nameValidation.error;
    }
    
    const colorValidation = validateRequired(formData.vehicleColor, 'Vehicle Color');
    if (!colorValidation.isValid) {
      newErrors.vehicleColor = colorValidation.error;
    }
    
    const slotValidation = validateRequired(formData.parkingSlotId, 'Parking Slot');
    if (!slotValidation.isValid) {
      newErrors.parkingSlotId = slotValidation.error;
    }
    
    const valetValidation = validateRequired(formData.valetId, 'Valet');
    if (!valetValidation.isValid) {
      newErrors.valetId = valetValidation.error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check subscription status
    if (subscriptionStatus === 'expired') {
      dispatch(addToast({
        type: 'error',
        message: 'Subscription expired. Please renew to continue.',
      }));
      return;
    }
    
    if (usage.remainingScans <= 0 && subscriptionStatus === 'grace_period') {
      dispatch(addToast({
        type: 'warning',
        message: 'Grace period active. Please pay pending amount.',
      }));
    }
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const vehicleData = {
        ...formData,
        qrCode: qrValue,
      };
      
      const newVehicle = await vehicleService.addVehicle(vehicleData);
      dispatch(addVehicle(newVehicle));
      dispatch(incrementScanCount());
      dispatch(addToast({
        type: 'success',
        message: 'Vehicle added successfully!',
      }));
      
      // Reset form and generate new QR
      setFormData({
        vehicleNumber: '',
        vehicleType: 'car',
        vehicleColor: '',
        customerPhone: '',
        customerName: '',
        parkingSlotId: '',
        valetId: '',
      });
      generateQRCode();
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: err.message || 'Failed to add vehicle',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        QR Scan & Customer Details
      </Typography>

      {/* Subscription Warning */}
      {subscriptionStatus === 'grace_period' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You are in grace period. Remaining scans: {usage.remainingScans}. Please renew your subscription.
        </Alert>
      )}

      {subscriptionStatus === 'expired' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Your subscription has expired. Please renew to continue using the service.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* QR Code Display */}
        <Grid item xs={12} md={4}>
          <Card title="Dynamic QR Code">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <QRCode value={qrValue} size={200} level="H" />
              </Box>
              
              <Typography variant="caption" color="text.secondary" textAlign="center">
                QR code refreshes every 30 seconds
              </Typography>
              
              <Button
                variant="outlined"
                size="small"
                onClick={generateQRCode}
              >
                Generate New QR
              </Button>

              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
                <strong>Current Code:</strong>
                <br />
                {qrValue}
              </Typography>
            </Box>
          </Card>

          {/* Subscription Usage */}
          <Card title="Subscription Usage" sx={{ mt: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Scans Used
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {usage.usedScans} / {usage.totalScans}
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  height: 8,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${(usage.usedScans / usage.totalScans) * 100}%`,
                    height: '100%',
                    bgcolor: subscriptionStatus === 'active' ? 'success.main' : 'warning.main',
                  }}
                />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Vehicle Entry Form */}
        <Grid item xs={12} md={8}>
          <Card title="Vehicle Details Entry">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Input
                    label="Vehicle Number"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    error={!!errors.vehicleNumber}
                    helperText={errors.vehicleNumber}
                    required
                    placeholder="MH12AB1234"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Input
                    select
                    label="Vehicle Type"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required
                  >
                    {Object.keys(VEHICLE_TYPES).map((key) => (
                      <MenuItem key={key} value={VEHICLE_TYPES[key]}>
                        {key}
                      </MenuItem>
                    ))}
                  </Input>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Input
                    label="Vehicle Color"
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleChange}
                    error={!!errors.vehicleColor}
                    helperText={errors.vehicleColor}
                    required
                    placeholder="Black, White, Red, etc."
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Input
                    label="Customer Phone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    error={!!errors.customerPhone}
                    helperText={errors.customerPhone}
                    required
                    placeholder="+919876543210"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Input
                    label="Customer Name"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    error={!!errors.customerName}
                    helperText={errors.customerName}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Input
                    select
                    label="Parking Slot"
                    name="parkingSlotId"
                    value={formData.parkingSlotId}
                    onChange={handleChange}
                    error={!!errors.parkingSlotId}
                    helperText={errors.parkingSlotId || 'Select available parking slot'}
                    required
                  >
                    {slots.filter(s => s.isAvailable).map((slot) => (
                      <MenuItem key={slot.id} value={slot.id}>
                        {slot.name}
                      </MenuItem>
                    ))}
                  </Input>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Input
                    select
                    label="Assign Valet"
                    name="valetId"
                    value={formData.valetId}
                    onChange={handleChange}
                    error={!!errors.valetId}
                    helperText={errors.valetId || 'Select valet to assign'}
                    required
                  >
                    {valetList.filter(v => v.isActive).map((valet) => (
                      <MenuItem key={valet.id} value={valet.id}>
                        {valet.name}
                      </MenuItem>
                    ))}
                  </Input>
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info">
                    Once submitted, valet will be notified to park the vehicle. Customer will receive QR code via SMS.
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={subscriptionStatus === 'expired'}
                    size="large"
                  >
                    Submit & Assign Valet
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default QRScanPage;
