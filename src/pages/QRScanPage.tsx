/**
 * QR Scan & Customer Details Entry Page - Enhanced
 * Dynamic QR code display with animated borders, modern form, and status timeline
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../types';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { Card, Input, Button } from '../components';
import { addToast } from '../redux';
import { vehicleService } from '../services';
import {
  VEHICLE_TYPES,
  validateVehicleNumber,
  validatePhone,
  validateRequired,
  cn,
} from '../utils';
// Note: Import vehicle and subscription slice actions directly
import { addVehicle } from '../redux/slices/vehicleSlice';
import { incrementScanCount } from '../redux/slices/subscriptionSlice';

const QRScanPage = () => {
  const dispatch = useDispatch();
  const { slots } = useSelector((state: RootState) => (state as any).parkingSlots || {});
  const { valetList } = useSelector((state: RootState) => (state as any).valets || {});
  const { status: subscriptionStatus, usage } = useSelector((state: RootState) => (state as any).subscription || {});
  
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
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    const newErrors: any = {};
    
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

  // Available slots count
  const availableSlots = slots.filter(s => s.isAvailable).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient-primary mb-2">
          QR Scan & Vehicle Entry
        </h1>
        <p className="text-white/70">
          Generate QR codes and register vehicle details for parking
        </p>
      </div>

      {/* Subscription Warnings */}
      {subscriptionStatus === 'grace_period' && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400">
            ⚠️ Grace Period Active: Remaining scans: {usage.remainingScans}. Please renew your subscription.
          </p>
        </div>
      )}

      {subscriptionStatus === 'expired' && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400">
            ❌ Subscription Expired: Please renew to continue using the service.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - QR Code & Stats */}
        <div className="space-y-6">
          {/* QR Code Display with Animated Border */}
          <Card>
            <div className="p-6 flex flex-col items-center">
              <h3 className="text-xl font-bold text-white mb-4">Dynamic QR Code</h3>
              
              {/* QR Code with animated scanning border */}
              <div className="relative mb-4">
                {/* Animated corners */}
                <div className="absolute inset-0 animate-pulse">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-lg" />
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-glow-primary">
                  <QRCode value={qrValue} size={200} level="H" />
                </div>
              </div>
              
              <p className="text-white/50 text-sm text-center mb-4">
                QR code refreshes every 30 seconds
              </p>
              
              <Button
                variant="outline"
                onClick={generateQRCode}
                className="w-full"
              >
                Generate New QR
              </Button>

              <div className="mt-4 p-3 bg-white/5 rounded-lg w-full">
                <p className="text-white/50 text-xs text-center">Current Code</p>
                <p className="text-white text-sm text-center font-mono break-all">
                  {qrValue}
                </p>
              </div>
            </div>
          </Card>

          {/* Subscription Usage */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Subscription Usage</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">Scans Used</span>
                  <span className="text-white font-bold">
                    {usage.usedScans} / {usage.totalScans}
                  </span>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      subscriptionStatus === 'active' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                        : 'bg-gradient-to-r from-yellow-500 to-orange-400'
                    }`}
                    style={{ width: `${Math.min((usage.usedScans / usage.totalScans) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-white/50 text-sm">
                  Available Slots: <span className="text-green-400 font-bold">{availableSlots}</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Status Timeline */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Parking Process</h3>
              <div className="space-y-3">
                {[
                  { step: 1, label: 'Fill Vehicle Details', active: true },
                  { step: 2, label: 'Assign Valet', active: false },
                  { step: 3, label: 'Vehicle Parked', active: false },
                  { step: 4, label: 'QR Sent to Customer', active: false },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                      item.active 
                        ? 'bg-gradient-primary text-white' 
                        : 'bg-white/10 text-white/50'
                    )}>
                      {item.step}
                    </div>
                    <span className={cn(
                      'text-sm',
                      item.active ? 'text-white' : 'text-white/50'
                    )}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Vehicle Entry Form */}
        <div className="lg:col-span-2">
          <Card title="Vehicle Details Entry">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <Input
                  select
                  label="Vehicle Type"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  {Object.keys(VEHICLE_TYPES).map((key) => (
                    <option key={key} value={VEHICLE_TYPES[key]}>
                      {key}
                    </option>
                  ))}
                </Input>

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
              </div>

              <Input
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                error={!!errors.customerName}
                helperText={errors.customerName}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="">Select Parking Slot</option>
                  {slots.filter(s => s.isAvailable).map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.name}
                    </option>
                  ))}
                </Input>

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
                  <option value="">Select Valet</option>
                  {valetList.filter(v => v.isActive).map((valet) => (
                    <option key={valet.id} value={valet.id}>
                      {valet.name}
                    </option>
                  ))}
                </Input>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300 text-sm">
                  ℹ️ Once submitted, the valet will be notified to park the vehicle. Customer will receive the QR code via SMS.
                </p>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={subscriptionStatus === 'expired'}
                variant="gradient"
                className="w-full py-3 text-lg"
              >
                Submit & Assign Valet
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRScanPage;
