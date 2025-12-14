/**
 * Profile Page
 * View and edit user profile, change password, upload profile picture
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Box,
  Typography,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import { PhotoCamera as CameraIcon } from '@mui/icons-material';
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Profile Settings
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Profile Picture */}
        <Grid item xs={12} md={4}>
          <Card title="Profile Picture">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{ width: 120, height: 120, fontSize: 48 }}
                src={user?.profilePicture}
              >
                {getInitials(user?.name)}
              </Avatar>
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<CameraIcon />}
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                />
              </Button>
              
              <Typography variant="caption" color="text.secondary" textAlign="center">
                Allowed formats: JPG, PNG (Max 5MB)
              </Typography>
            </Box>
          </Card>

          {/* Role Info */}
          <Card title="Account Info" sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {user?.role?.replace('_', ' ').toUpperCase()}
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Card title="Personal Information">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    loading={loading}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>

          {/* Change Password */}
          <Card title="Change Password" sx={{ mt: 3 }}>
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Input
                    label="Current Password"
                    name="oldPassword"
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    error={!!passwordErrors.oldPassword}
                    helperText={passwordErrors.oldPassword}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info">
                    Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    loading={passwordLoading}
                  >
                    Change Password
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

export default Profile;
