/**
 * Profile Page - Enhanced
 * Modern profile with stats, activity timeline, and glassmorphism design
 */

import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Camera,
  Mail,
  Phone,
  Shield,
  Calendar,
  Car,
  Clock,
  TrendingUp,
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

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const response = await authService.uploadProfilePicture(file);
      dispatch(updateProfile({ profilePicture: response.url }));
      dispatch(addToast({
        type: 'success',
        message: 'Profile picture updated!',
      }));
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: 'Failed to upload profile picture',
      }));
    }
  };

  // Mock stats and activity data
  const stats = useMemo(() => ({
    carsParked: 156,
    avgTime: '2h 15m',
    totalRevenue: 45600,
    rating: 4.8,
  }), []);

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
      user?.profilePicture,
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
          {/* Profile Picture Card */}
          <Card>
            <div className="p-6 flex flex-col items-center">
              {/* Avatar with gradient border */}
              <div className="relative mb-4 group">
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-32 h-32 rounded-full bg-gradient-primary p-1">
                  <div className="w-full h-full rounded-full bg-[#1a1a2e] flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user?.name)
                    )}
                  </div>
                </div>
                
                {/* Upload button overlay */}
                <label className="absolute bottom-0 right-0 bg-gradient-primary p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-glow-primary">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                  />
                </label>
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">
                {user?.name || 'User'}
              </h3>
              <p className="text-white/60 text-sm mb-4">
                {user?.role?.replace('_', ' ').toUpperCase()}
              </p>

              {/* Profile Completion */}
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">Profile Completion</span>
                  <span className="text-white font-semibold">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
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

          {/* Stats Cards */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Car className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-white/70">Cars Parked</span>
                  </div>
                  <span className="text-white font-bold">{stats.carsParked}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-white/70">Avg. Time</span>
                  </div>
                  <span className="text-white font-bold">{stats.avgTime}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-white/70">Total Revenue</span>
                  </div>
                  <span className="text-white font-bold">₹{stats.totalRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Info */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Account Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/70">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">
                    {user?.role?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">
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
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 z-10" />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      className="pl-10"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 z-10" />
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      className="pl-10"
                      required
                    />
                  </div>
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
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 z-10" />
                <Input
                  label="Current Password"
                  name="oldPassword"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  error={!!passwordErrors.oldPassword}
                  helperText={passwordErrors.oldPassword}
                  className="pl-10"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 z-10" />
                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 z-10" />
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword}
                    className="pl-10"
                    required
                  />
                </div>
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
            <div className="p-6">
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
