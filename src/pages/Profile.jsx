/**
 * Profile Page - Enhanced
 * Modern profile with stats, activity timeline, and glassmorphism design
 */

import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  Shield,
  Calendar,
  Car,
  CheckCircle,
  Lock,
  User,
} from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { updateProfile } from '../redux/slices/authSlice';
import { addToast } from '../redux/slices/notificationSlice';
import authService from '../services/authService';
import {
  validateEmail,
  validatePhone,
  validateName,
  validatePassword,
  validatePasswordMatch,
} from '../utils/validators';
import { getInitials } from '../utils/helpers';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    
    const nameValidation = validateName(formData.name, 'Full Name');
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    }
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }
    
    const newPasswordValidation = validatePassword(passwordData.newPassword);
    if (!newPasswordValidation.isValid) {
      newErrors.newPassword = newPasswordValidation.error;
    }
    
    const confirmPasswordValidation = validatePasswordMatch(
      passwordData.newPassword,
      passwordData.confirmPassword
    );
    if (!confirmPasswordValidation.isValid) {
      newErrors.confirmPassword = confirmPasswordValidation.error;
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const updatedUser = await authService.updateProfile(formData);
      dispatch(updateProfile(updatedUser));
      dispatch(addToast({
        type: 'success',
        message: 'Profile updated successfully!',
      }));
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: err.message || 'Failed to update profile',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      await authService.changePassword(passwordData);
      dispatch(addToast({
        type: 'success',
        message: 'Password changed successfully!',
      }));
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: err.message || 'Failed to change password',
      }));
    } finally {
      setPasswordLoading(false);
    }
  };

  // Mock stats and activity data (removed unused variable)
  // const stats = useMemo(() => ({
  //   carsParked: 156,
  //   avgTime: '2h 15m',
  //   totalRevenue: 45600,
  //   rating: 4.8,
  // }), []);

  const activityTimeline = useMemo(() => [
    { id: 1, action: 'Updated profile information', time: '2 hours ago', icon: User },
    { id: 2, action: 'Parked vehicle MH-01-AB-1234', time: '5 hours ago', icon: Car },
    { id: 3, action: 'Changed password', time: '2 days ago', icon: Lock },
    { id: 4, action: 'Completed parking session', time: '3 days ago', icon: CheckCircle },
  ], []);

  // Calculate profile completion
  const profileCompletion = useMemo(() => {
    const fields = [
      user?.name,
      user?.email,
      user?.phone,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient-primary mb-2">
          Profile Settings
        </h1>
        <p className="text-white/70">
          Manage your account and view your activity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card & Stats */}
        <div className="space-y-6">
          {/* Profile Picture Card - REDUCED HEIGHT */}
          <Card>
            <div className="p-4 flex flex-col items-center">
              {/* Avatar with gradient border - SMALLER - NO UPLOAD */}
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur opacity-75 transition-opacity" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-primary p-1">
                  <div className="w-full h-full rounded-full bg-[#1a1a2e] flex items-center justify-center text-3xl font-bold text-white">
                    {getInitials(user?.name)}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                {user?.name || 'User'}
              </h3>
              <p className="text-white/60 text-xs mb-3">
                {user?.role?.replace('_', ' ').toUpperCase()}
              </p>

              {/* Profile Completion - COMPACT */}
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/70 text-xs">Profile Completion</span>
                  <span className="text-white font-semibold text-sm">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-primary"
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Account Info - COMPACT */}
          <Card>
            <div className="p-3">
              <h3 className="text-lg font-bold text-white mb-2">Account Info</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/70">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs">
                    {user?.role?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">
                    Member since {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card title="Personal Information">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  icon={<User className="w-5 h-5" />}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    icon={<Mail className="w-5 h-5" />}
                    required
                  />

                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    icon={<Phone className="w-5 h-5" />}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                variant="gradient"
                className="w-full"
              >
                Save Changes
              </Button>
            </form>
          </Card>

          {/* Change Password */}
          <Card title="Change Password">
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <Input
                label="Current Password"
                name="oldPassword"
                type="password"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                error={!!passwordErrors.oldPassword}
                helperText={passwordErrors.oldPassword}
                icon={<Lock className="w-5 h-5" />}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword}
                  icon={<Lock className="w-5 h-5" />}
                  required
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword}
                  icon={<Lock className="w-5 h-5" />}
                  required
                />
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300 text-sm">
                  Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.
                </p>
              </div>

              <Button
                type="submit"
                loading={passwordLoading}
                variant="gradient"
                className="w-full"
              >
                Change Password
              </Button>
            </form>
          </Card>

          {/* Activity Timeline */}
          <Card title="Recent Activity">
            <div className="p-4">
              <div className="space-y-4">
                {activityTimeline.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                    >
                      <div className="p-2 bg-gradient-primary rounded-lg">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-white/50 text-sm">{activity.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
