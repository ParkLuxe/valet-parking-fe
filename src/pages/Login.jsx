/**
 * Enhanced Login Page with Premium Split-Screen Design
 * Features glassmorphism, gradient animations, and floating stats
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { Car, Users, Building, Shield, User, Lock, AlertCircle, Info } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { loginSuccess, setLoading } from '../redux/slices/authSlice';
import { addToast } from '../redux/slices/notificationSlice';
import authService from '../services/authService';
import { validateRequired } from '../utils/validators';
import { PLACEHOLDER_CREDENTIALS } from '../utils/constants';
import { cn } from '../utils/cn';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [selectedTab, setSelectedTab] = useState(0); // 0: Host, 1: Host User, 2: Super Admin
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoadingState] = useState(false);
  const [error, setError] = useState('');

  const roles = ['HOSTADMIN', 'HOSTUSER', 'SUPERADMIN'];
  const roleLabels = ['Host', 'Host User (Valet)', 'Super Admin'];

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
    
    const usernameValidation = validateRequired(formData.username, 'Username');
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error;
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
    if (role === 'SUPERADMIN') return PLACEHOLDER_CREDENTIALS.superAdmin;
    if (role === 'HOSTUSER') return PLACEHOLDER_CREDENTIALS.valet;
    return PLACEHOLDER_CREDENTIALS.host;
  };

  const placeholderCreds = getPlaceholderCreds();

  // Floating stats for hero section
  const stats = [
    { label: 'Cars Parked', value: '10K+', icon: Car },
    { label: 'Active Valets', value: '500+', icon: Users },
    { label: 'Trusted Hosts', value: '100+', icon: Building },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Hero Section with Gradient and Stats */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-slow [animation-delay:1s]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-lg blur opacity-50" />
              <div className="relative bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <img 
                  src="/parkluxe-logo-192.png" 
                  alt="ParkLuxe Logo" 
                  className="w-8 h-8"
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Park-Luxe</h1>
              <p className="text-white/80 text-sm">Valet Parking Excellence</p>
            </div>
          </motion.div>

          {/* Main Text */}
          <div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-5xl font-bold mb-6 leading-tight"
            >
              Premium Valet<br />Parking Experience
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-white/90 mb-12"
            >
              Seamlessly manage your valet operations with real-time tracking and analytics.
            </motion.p>

            {/* Floating Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="glass-card p-4 text-center hover:-translate-y-1 transition-transform"
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-white/70">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 text-white/60 text-sm"
          >
            <Shield className="w-4 h-4" />
            <span>Secure • Reliable • Professional</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="bg-gradient-primary p-3 rounded-lg">
              <img 
                src="/parkluxe-logo-192.png" 
                alt="ParkLuxe Logo" 
                className="w-8 h-8"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Park-Luxe</h1>
              <p className="text-white/60 text-sm">Valet Management</p>
            </div>
          </div>

          {/* Welcome Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/60">Sign in to your account to continue</p>
          </motion.div>

          {/* Role Selection Tabs */}
          <Tabs.Root
            value={roles[selectedTab]}
            onValueChange={(value) => {
              const index = roles.indexOf(value);
              setSelectedTab(index);
              setErrors({});
              setError('');
            }}
            className="mb-6"
          >
            <Tabs.List className="grid grid-cols-3 gap-2 glass-card p-1 rounded-button">
              {roleLabels.map((label, index) => (
                <Tabs.Trigger
                  key={roles[index]}
                  value={roles[index]}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-button transition-all',
                    'data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-lg',
                    'data-[state=inactive]:text-white/60 data-[state=inactive]:hover:text-white'
                  )}
                >
                  {label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-4 mb-4 border-l-4 border-error"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <p className="text-white text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dev Credentials Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-4 mb-6 border-l-4 border-primary"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-white font-semibold mb-1">Development Credentials</p>
                <p className="text-white/70">Username: {placeholderCreds.username || placeholderCreds.email}</p>
                <p className="text-white/70">Password: {placeholderCreds.password}</p>
              </div>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              required
              autoComplete="username"
              autoFocus
              icon={<User className="w-5 h-5" />}
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
              icon={<Lock className="w-5 h-5" />}
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              size="large"
              variant="primary"
            >
              Sign In
            </Button>
          </motion.form>

          {/* Register Link */}
          {selectedTab === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-white/60 text-sm"
            >
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-primary-light font-medium transition-colors"
              >
                Register as Host
              </Link>
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
