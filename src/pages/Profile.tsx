/**
 * Profile Page - Enhanced
 * Modern profile with stats, activity timeline, and glassmorphism design
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  MapPin,
  Building2,
  CreditCard,
  Briefcase,
} from 'lucide-react';
import { Card, Input, Button, LoadingSpinner } from '../components';
import { updateProfile, addToast } from '../redux';
import { useUpdateProfile, useChangePassword } from '../hooks/queries/useAuth';
import { useCurrentUserProfile } from '../hooks/queries/useHostUsers';
import { useStatesByCountry } from '../hooks/queries/useCountries';
import { useCityLocationSuggestions, usePostalCodeLookup } from '../hooks/queries/useLocationSuggestions';
import { useTheme } from '../contexts/ThemeContext';
import type { RootState } from '../redux';
import {
  validateEmail,
  validatePhone,
  validateName,
  validatePassword,
  validatePasswordMatch,
  getInitials,
} from '../utils';

const Profile = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { colors, isDark } = useTheme();
  
  // Use TanStack Query hook to fetch user profile
  const { data: userProfile, isLoading: profileLoading, error } = useCurrentUserProfile();
  
  // Use profile data if available, otherwise fall back to auth user
  const user = userProfile || authUser;
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    userName: '',
    designation: '',
    contactNumber: '',
    dlNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  });

  // Update form data when user profile loads (derive firstName/lastName from name when missing)
  React.useEffect(() => {
    if (user) {
      let firstName = user.firstName ?? '';
      let lastName = user.lastName ?? '';
      if ((!firstName || !lastName) && user.name) {
        const parts = user.name.trim().split(/\s+/);
        if (!firstName) firstName = parts[0] ?? '';
        if (!lastName) lastName = parts.slice(1).join(' ') ?? '';
      }
      setFormData({
        firstName,
        middleName: user.middleName ?? '',
        lastName,
        email: user.email ?? '',
        phone: user.phone ?? user.contactNumber ?? '',
        userName: user.userName ?? user.username ?? '',
        designation: user.designation ?? '',
        contactNumber: user.contactNumber ?? user.phone ?? '',
        dlNumber: user.dlNumber ?? '',
        addressLine1: user.addressLine1 ?? '',
        addressLine2: user.addressLine2 ?? '',
        city: user.city ?? '',
        state: user.state ?? '',
        postalCode: user.postalCode ?? '',
      });
    }
  }, [user]);
  
  // Show error toast
  useEffect(() => {
    if (error) {
      dispatch(addToast({
        type: 'error',
        message: (error as Error).message || 'Failed to load profile',
      }));
    }
  }, [error, dispatch]);

  // Helper functions for role formatting
  const getRoleName = (user: any): string => {
    if (!user) return '';
    // Check multiple possible role properties
    const role = user.roleName || user.role || '';
    return typeof role === 'object' ? role.name : role;
  };
  
  const formatRole = (user: any): string => {
    const roleName = getRoleName(user);
    if (!roleName) return 'Unknown';
    const roleMap: Record<string, string> = {
      'SUPERADMIN': 'Super Admin',
      'HOSTADMIN': 'Host Admin',
      'HOSTUSER': 'Host User',
      'VALET': 'Valet',
    };
    return roleMap[roleName.toUpperCase()] || roleName;
  };

  const getRoleBadgeClass = (user: any): string => {
    const roleName = getRoleName(user);
    if (!roleName) return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    const roleUpper = roleName.toUpperCase();
    const classMap: Record<string, string> = {
      'SUPERADMIN': 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      'HOSTADMIN': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      'HOSTUSER': 'bg-green-500/20 text-green-300 border border-green-500/30',
      'VALET': 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    };
    return classMap[roleUpper] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
  };
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const { data: statesResponse, isLoading: statesLoading } = useStatesByCountry('IN');
  const { data: cityLocationSuggestions = [], isLoading: citySuggestionsLoading } = useCityLocationSuggestions(formData.city, formData.state);
  const { data: postalLookupSuggestions = [], isFetching: postalLookupLoading } = usePostalCodeLookup(formData.postalCode);

  const stateSuggestions = useMemo(() => {
    const rawStates = Array.isArray(statesResponse)
      ? statesResponse
      : Array.isArray((statesResponse as any)?.content)
        ? (statesResponse as any).content
        : Array.isArray((statesResponse as any)?.data)
          ? (statesResponse as any).data
          : [];

    return rawStates
      .map((state: any) => {
        const value = state.name || state.stateName || state.state || '';
        return { label: value, value };
      })
      .filter((state: { value: string }) => state.value)
      .filter((state: { value: string }) =>
        !formData.state.trim() || state.value.toLowerCase().includes(formData.state.trim().toLowerCase())
      );
  }, [formData.state, statesResponse]);

  const citySuggestions = useMemo(() => {
    const seen = new Set<string>();
    return cityLocationSuggestions
      .filter((item) => {
        const key = `${item.city}|${item.state}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      })
      .map((item) => ({
        label: item.city,
        value: item.city,
        meta: item.state,
        payload: item,
      }));
  }, [cityLocationSuggestions]);

  const postalSuggestions = useMemo(() => {
    const source = cityLocationSuggestions.length > 0 ? cityLocationSuggestions : postalLookupSuggestions;
    const seen = new Set<string>();
    return source
      .filter((item) => {
        if (!item.postalCode || seen.has(item.postalCode)) {
          return false;
        }
        seen.add(item.postalCode);
        return true;
      })
      .filter((item) => !formData.postalCode.trim() || item.postalCode.includes(formData.postalCode.trim()))
      .map((item) => ({
        label: item.postalCode,
        value: item.postalCode,
        meta: `${item.city}, ${item.state}`,
        payload: item,
      }));
  }, [cityLocationSuggestions, formData.postalCode, postalLookupSuggestions]);

  useEffect(() => {
    if (formData.postalCode.trim().length < 6 || postalLookupSuggestions.length === 0) {
      return;
    }

    const match = postalLookupSuggestions[0];
    setFormData((prev) =>
      prev.city === match.city && prev.state === match.state
        ? prev
        : {
            ...prev,
            city: match.city,
            state: match.state,
          }
    );
  }, [formData.postalCode, postalLookupSuggestions]);

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

  const handleStateSuggestionSelect = (suggestion: { value: string }) => {
    setFormData((prev) => ({
      ...prev,
      state: suggestion.value,
      city: '',
      postalCode: '',
    }));
  };

  const handleCitySuggestionSelect = (suggestion: { value: string; payload?: any }) => {
    const payload = suggestion.payload;
    setFormData((prev) => ({
      ...prev,
      city: suggestion.value,
      state: payload?.state || prev.state,
    }));
  };

  const handlePostalSuggestionSelect = (suggestion: { value: string; payload?: any }) => {
    const payload = suggestion.payload;
    setFormData((prev) => ({
      ...prev,
      postalCode: suggestion.value,
      city: payload?.city || prev.city,
      state: payload?.state || prev.state,
    }));
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
    const newErrors: any = {};
    
    // Only validate firstName if a value is provided (it's optional in the User type)
    const firstName = formData.firstName?.trim();
    if (firstName) {
      const firstNameValidation = validateName(firstName, 'First Name');
      if (!firstNameValidation.isValid) {
        newErrors.firstName = firstNameValidation.error;
      }
    }
    
    // Only validate middleName if a value is provided (it's optional in the User type)
    const middleName = formData.middleName?.trim();
    if (middleName) {
      const middleNameValidation = validateName(middleName, 'Middle Name');
      if (!middleNameValidation.isValid) {
        newErrors.middleName = middleNameValidation.error;
      }
    }
    
    // Only validate lastName if a value is provided (it's optional in the User type)
    const lastName = formData.lastName?.trim();
    if (lastName) {
      const lastNameValidation = validateName(lastName, 'Last Name');
      if (!lastNameValidation.isValid) {
        newErrors.lastName = lastNameValidation.error;
      }
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
    const newErrors: any = {};
    
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

  const updateProfileMutation = useUpdateProfile();
  const loading = updateProfileMutation.isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) {
      return;
    }
    
    try {
      const userId = user?.id;
      if (!userId) {
        dispatch(addToast({ type: 'error', message: 'User ID not found. Please log in again.' }));
        return;
      }
      const payload = {
        userId,
        email: formData.email,
        firstName: formData.firstName,
        middleName: formData.middleName || null,
        lastName: formData.lastName,
        userName: formData.userName,
        isEmailVerified: user?.isEmailVerified ?? false,
        isApproved: user?.isApproved ?? false,
        designation: formData.designation || null,
        contactNumber: formData.contactNumber || formData.phone,
        dlNumber: formData.dlNumber || null,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
      };
      const updatedUser = await updateProfileMutation.mutateAsync(payload);
      dispatch(updateProfile(updatedUser));
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: (err as Error).message || 'Failed to update profile',
      }));
    }
  };

  const changePasswordMutation = useChangePassword();
  const passwordLoading = changePasswordMutation.isPending;

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      const userId = user?.id;
      if (!userId) {
        dispatch(addToast({ type: 'error', message: 'User ID not found. Please log in again.' }));
        return;
      }
      await changePasswordMutation.mutateAsync({
        userId,
        currentPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      // Toast shown by useChangePassword onSuccess; only clear form here
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        message: (err as Error).message || 'Failed to change password',
      }));
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
    const hasName = !!user?.name || !!user?.firstName;
    const hasEmail = !!user?.email;
    const hasPhone = !!user?.phone || !!user?.contactNumber;
    const hasRole = !!getRoleName(user);
    const hasDesignation = !!user?.designation;
    const hasAddress = !!user?.addressLine1;
    const hasCity = !!user?.city;
    
    const fields = [hasName, hasEmail, hasPhone, hasRole, hasDesignation, hasAddress, hasCity];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [user]);

  if (profileLoading && !userProfile) {
    return <LoadingSpinner message="Loading profile..." fullScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient-primary mb-2">
          Profile Settings
        </h1>
        <p style={{ color: colors.textMuted }}>
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
                <div
                  className="absolute inset-0 rounded-full blur opacity-75 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primaryBtn}, ${colors.primaryBtnHover})`,
                  }}
                />
                <div
                  className="relative w-24 h-24 rounded-full p-1"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primaryBtn}, ${colors.primaryBtnHover})`,
                  }}
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-3xl font-bold"
                    style={{ background: colors.surfaceInset, color: colors.text }}
                  >
                    {(() => {
                      if (user?.firstName || user?.lastName) {
                        const first = user?.firstName?.charAt(0) || '';
                        const last = user?.lastName?.charAt(0) || '';
                        return (first + last).toUpperCase() || getInitials(user?.name);
                      }
                      return getInitials(user?.name);
                    })()}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-1" style={{ color: colors.text }}>
                {(() => {
                  const nameParts = [
                    user?.firstName,
                    user?.middleName,
                    user?.lastName
                  ].filter(Boolean);
                  return nameParts.length > 0 ? nameParts.join(' ') : (user?.name || 'User');
                })()}
              </h3>
              <div className="mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeClass(user)}`}>
                  {formatRole(user)}
                </span>
              </div>

              {/* Profile Completion - COMPACT */}
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: colors.textMuted }}>Profile Completion</span>
                  <span className="font-semibold text-sm" style={{ color: colors.text }}>{profileCompletion}%</span>
                </div>
                <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: colors.divider }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion}%` }}
                    transition={{ duration: 1 }}
                    className="h-full"
                    style={{ background: `linear-gradient(90deg, ${colors.primaryBtn}, ${colors.primaryBtnHover})` }}
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Account Info - COMPACT */}
          <Card>
            <div className="p-3">
              <h3 className="text-lg font-bold mb-3" style={{ color: colors.text }}>Account Info</h3>
              <div className="space-y-3">
                <div className="p-2 rounded-lg" style={{ background: colors.surfaceInset }}>
                  <div className="flex items-center gap-2 mb-1" style={{ color: colors.textMuted }}>
                    <Shield className="w-4 h-4" />
                    <span className="text-xs">Role</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeClass(user)}`}>
                    {formatRole(user)}
                  </span>
                </div>
                <div className="flex items-center gap-2" style={{ color: colors.textMuted }}>
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    icon={<User className="w-5 h-5" />}
                    required
                  />
                  <Input
                    label="Middle Name"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    error={!!errors.middleName}
                    helperText={errors.middleName}
                    icon={<User className="w-5 h-5" />}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    icon={<User className="w-5 h-5" />}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Username"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    icon={<User className="w-5 h-5" />}
                    disabled
                  />
                  <Input
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    icon={<Briefcase className="w-5 h-5" />}
                    placeholder="e.g. CEO, Manager"
                  />
                </div>

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
                    label="Contact Number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    icon={<Phone className="w-5 h-5" />}
                    placeholder="+91XXXXXXXXXX"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    icon={<Phone className="w-5 h-5" />}
                  />
                  <Input
                    label="DL Number"
                    name="dlNumber"
                    value={formData.dlNumber}
                    onChange={handleChange}
                    icon={<CreditCard className="w-5 h-5" />}
                    placeholder="Driving License Number"
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="pt-4 border-t" style={{ borderColor: colors.divider }}>
                <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: colors.text }}>
                  <MapPin className="w-4 h-4" style={{ color: isDark ? '#60a5fa' : '#2563eb' }} />
                  Address Information
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Address Line 1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    icon={<MapPin className="w-5 h-5" />}
                    placeholder="Street address"
                  />
                  <Input
                    label="Address Line 2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    icon={<MapPin className="w-5 h-5" />}
                    placeholder="Apt, suite, floor (optional)"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      helperText="Select the state first to tighten the city and postal suggestions"
                      icon={<Building2 className="w-5 h-5" />}
                      suggestions={stateSuggestions}
                      onSuggestionSelect={handleStateSuggestionSelect}
                      loadingSuggestions={statesLoading}
                    />
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      helperText={formData.state ? 'City suggestions are filtered by the selected state' : 'Enter or select a state first'}
                      icon={<Building2 className="w-5 h-5" />}
                      suggestions={formData.state ? citySuggestions : []}
                      onSuggestionSelect={handleCitySuggestionSelect}
                      loadingSuggestions={!!formData.state && citySuggestionsLoading}
                    />
                    <Input
                      label="Postal Code"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      helperText="Typing a full postal code will auto-fill city and state"
                      icon={<MapPin className="w-5 h-5" />}
                      suggestions={postalSuggestions}
                      onSuggestionSelect={handlePostalSuggestionSelect}
                      loadingSuggestions={postalLookupLoading}
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
                        className="flex items-start gap-4 p-3 rounded-lg transition-all"
                        style={{ background: colors.surfaceInset }}
                        onMouseEnter={e => { e.currentTarget.style.background = colors.hoverBg; }}
                        onMouseLeave={e => { e.currentTarget.style.background = colors.surfaceInset; }}
                    >
                      <div
                        className="p-2 rounded-lg"
                        style={{ background: `linear-gradient(135deg, ${colors.primaryBtn}, ${colors.primaryBtnHover})` }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: '#ffffff' }} />
                      </div>
                      <div className="flex-1">
                          <p className="font-medium" style={{ color: colors.text }}>{activity.action}</p>
                          <p className="text-sm" style={{ color: colors.textMuted }}>{activity.time}</p>
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
