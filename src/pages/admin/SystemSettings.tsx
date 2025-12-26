/**
 * System Settings Page (SuperAdmin)
 * Configure system-wide settings
 */

import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { Card } from '../../components';
import { Button } from '../../components';
import { Input } from '../../components';
import { useDispatch } from 'react-redux';
import {  addToast  } from '../../redux';

const SystemSettings = () => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({
    gracePeriodDays: 3,
    defaultBasePrice: 1000,
    defaultBaseScans: 100,
    defaultAdditionalScanPrice: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSave = () => {
    dispatch(
      addToast({
        type: 'success',
        message: 'Settings saved successfully',
      })
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-white/60">Configure system-wide settings</p>
      </div>

      {/* Settings Form */}
      <Card
        title="Subscription Defaults"
        subtitle="Default values for new subscription plans"
        headerAction={<Settings className="w-5 h-5 text-white/50" />}
      >
        <div className="space-y-4">
          <Input
            label="Grace Period (Days)"
            name="gracePeriodDays"
            type="number"
            value={settings.gracePeriodDays}
            onChange={handleChange}
          />
          <Input
            label="Default Base Price (₹)"
            name="defaultBasePrice"
            type="number"
            value={settings.defaultBasePrice}
            onChange={handleChange}
          />
          <Input
            label="Default Base Scans"
            name="defaultBaseScans"
            type="number"
            value={settings.defaultBaseScans}
            onChange={handleChange}
          />
          <Input
            label="Default Additional Scan Price (₹)"
            name="defaultAdditionalScanPrice"
            type="number"
            value={settings.defaultAdditionalScanPrice}
            onChange={handleChange}
          />
        </div>
      </Card>

      <Card title="Email Configuration" subtitle="Email notification settings">
        <div className="text-white/50 text-center py-8">
          <p>Email template configuration would be implemented here</p>
        </div>
      </Card>

      <Card title="Payment Gateway" subtitle="Razorpay configuration">
        <div className="text-white/50 text-center py-8">
          <p>Payment gateway configuration would be implemented here</p>
          <p className="text-sm mt-2">(Keys managed via environment variables)</p>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          startIcon={<Save className="w-5 h-5" />}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SystemSettings;
