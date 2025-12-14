/**
 * Login Page
 * Separate login flows for Host, Host Users (Valets), and Super Admin
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { LocalParking as LogoIcon } from '@mui/icons-material';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { loginSuccess, setLoading } from '../redux/slices/authSlice';
import { addToast } from '../redux/slices/notificationSlice';
import authService from '../services/authService';
import { validateEmail, validateRequired } from '../utils/validators';
import { PLACEHOLDER_CREDENTIALS } from '../utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [selectedTab, setSelectedTab] = useState(0); // 0: Host, 1: Host User, 2: Super Admin
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoadingState] = useState(false);
  const [error, setError] = useState('');

  const roles = ['host', 'valet', 'super_admin'];
  const roleLabels = ['Host', 'Host User (Valet)', 'Super Admin'];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setErrors({});
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    
    const passwordValidation = validateRequired(formData.password, 'Password');
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) {
      return;
    }
    
    setLoadingState(true);
    dispatch(setLoading(true));
    
    try {
      const response = await authService.login({
        ...formData,
        role: roles[selectedTab],
      });
      
      dispatch(loginSuccess(response));
      dispatch(addToast({
        type: 'success',
        message: 'Login successful!',
      }));
      
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      dispatch(addToast({
        type: 'error',
        message: errorMessage,
      }));
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  // Get placeholder credentials for current role
  const getPlaceholderCreds = () => {
    const role = roles[selectedTab];
    if (role === 'super_admin') return PLACEHOLDER_CREDENTIALS.superAdmin;
    if (role === 'valet') return PLACEHOLDER_CREDENTIALS.valet;
    return PLACEHOLDER_CREDENTIALS.host;
  };

  const placeholderCreds = getPlaceholderCreds();

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <LogoIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography component="h1" variant="h4" fontWeight="bold">
              Park-Luxe
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Valet Parking Management System
            </Typography>
          </Box>

          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            {roleLabels.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Development credentials notice */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="caption" display="block">
              <strong>Development Credentials:</strong>
            </Typography>
            <Typography variant="caption" display="block">
              Email: {placeholderCreds.email}
            </Typography>
            <Typography variant="caption">
              Password: {placeholderCreds.password}
            </Typography>
          </Alert>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                autoComplete="email"
                autoFocus
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                loading={loading}
                size="large"
              >
                Sign In
              </Button>
            </Box>
          </form>

          {selectedTab === 0 && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  Register as Host
                </Link>
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
