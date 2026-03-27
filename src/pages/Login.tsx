/**
 * Enhanced Login Page with Premium Split-Screen Design
 * Features glassmorphism, gradient animations, and floating stats
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { Car, Users, Building, Shield, User, Lock, AlertCircle } from 'lucide-react';
import { Input, Button } from '../components';
import { setAuthLoading, addToast, setUserData } from '../redux';
import { useLogin } from '../hooks/queries/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { fetchCurrentUserProfile } from '../hooks/queries/useHostUsers';
import type { User as UserType, AuthResponse } from '../types/api';
import { validateRequired } from '../utils';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [selectedTab, setSelectedTab] = useState(0); // 0: Host, 1: Host User, 2: Super Admin
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const roles = ['HOSTADMIN', 'HOSTUSER', 'SUPERADMIN'];
  const roleLabels = ['Host', 'Host User (Valet)', 'Super Admin'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
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
    const newErrors: any = {};
    
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

  const loginMutation = useLogin();
  const loading = loginMutation.isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) {
      return;
    }
    
    dispatch(setAuthLoading(true));
    
    let loginSucceeded = false;
    let authData: AuthResponse | null = null;
    try {
      // mutation's onSuccess in useLogin already dispatches loginSuccess + toast once
      authData = await loginMutation.mutateAsync({ ...formData, role: roles[selectedTab] });
      loginSucceeded = true;

      // Fetch profile via TanStack Query (populates cache for useCurrentUserProfile)
      const userData = await queryClient.fetchQuery({
        queryKey: queryKeys.users.profile(),
        queryFn: fetchCurrentUserProfile,
      });
      const normalized = { ...userData } as Record<string, unknown>;
      if (normalized.role && typeof normalized.role === 'object' && normalized.role !== null && 'name' in normalized.role) {
        normalized.roleName = (normalized.role as { name: string }).name;
      } else if (typeof normalized.role === 'string') {
        normalized.roleName = normalized.role;
      }
      if (normalized.role) delete normalized.role;
      normalized.name = [normalized.firstName, normalized.middleName, normalized.lastName]
        .filter(Boolean)
        .join(' ')
        .trim();
      dispatch(setUserData(normalized as unknown as UserType));

      navigate('/dashboard');
    } catch (err) {
      if (loginSucceeded && authData) {
        // Profile fetch failed after successful login: keep credentials, set minimal user so Redux is populated
        const u: Partial<UserType> = authData.user ?? {};
        const fullName = u.name ?? authData.name ?? 'User';
        const nameParts = String(fullName).trim().split(/\s+/);
        const firstName = u.firstName ?? nameParts[0] ?? '';
        const lastName = u.lastName ?? nameParts.slice(1).join(' ') ?? '';
        const minimalUser: UserType = {
          ...u,
          id: u.id ?? authData.id ?? '',
          name: fullName,
          firstName,
          lastName,
          email: u.email ?? authData.email ?? '',
          roleName: u.roleName ?? u.role ?? authData.role,
        };
        dispatch(setUserData(minimalUser));
        dispatch(addToast({
          type: 'info',
          message: 'Profile could not be loaded. You can continue to the dashboard and retry from your profile.',
        }));
        navigate('/dashboard');
      } else {
        const e = err as { message?: string; error?: string };
        const errorMessage =
          (typeof e?.message === 'string' ? e.message : null) ||
          (typeof e?.error === 'string' ? e.error : null) ||
          'Login failed. Please try again.';
        setError(errorMessage);
        dispatch(addToast({
          type: 'error',
          message: errorMessage,
        }));
      }
    } finally {
      dispatch(setAuthLoading(false));
    }
  };



  // Floating stats for hero section
  const stats = [
    { label: 'Cars Parked', value: '10K+', icon: Car },
    { label: 'Active Valets', value: '500+', icon: Users },
    { label: 'Trusted Hosts', value: '100+', icon: Building },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#09090f' }}>
      {/* Left Side - Hero Section with dark midnight tones */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Midnight Dark Background */}
        <div className="absolute inset-0" style={{ background: '#09090f' }} />
        
        {/* Animated Background Pattern — cyan accent glows */}
        <div className="absolute inset-0" style={{ opacity: 0.12 }}>
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse-slow" style={{ background: '#8b5cf6' }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse-slow" style={{ background: '#7c3aed', animationDelay: '1s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12" style={{ color: '#dae2fd' }}>
          {/* Logo */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-lg" style={{ background: '#8b5cf6', opacity: 0.5 }} />
              <div className="relative p-3 rounded-lg" style={{ background: 'rgba(139,92,246,0.15)', backdropFilter: 'blur(8px)' }}>
                <img 
                  src="/parkluxe-logo-192.png" 
                  alt="ParkLuxe Logo" 
                  className="w-8 h-8"
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: '#dae2fd' }}>Park-Luxe</h1>
              <p className="text-sm" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>Valet Parking Excellence</p>
            </div>
          </motion.div>

          {/* Main Text */}
          <div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#dae2fd' }}
            >
              Premium Valet<br />Parking Experience
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl mb-12"
              style={{ color: '#c6c6cd', fontFamily: 'Inter, sans-serif' }}
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
                    className="p-4 text-center hover:-translate-y-1 transition-transform rounded-[12px]"
                    style={{
                      background: 'rgba(45,52,73,0.5)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                    }}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                    <p className="text-2xl font-bold" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>{stat.value}</p>
                    <p className="text-sm" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>{stat.label}</p>
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
            className="flex items-center gap-2 text-sm"
            style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}
          >
            <Shield className="w-4 h-4" style={{ color: '#8b5cf6' }} />
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
        style={{ background: '#09090f' }}
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-3 rounded-[0.375rem]" style={{ background: '#8b5cf6' }}>
              <img 
                src="/parkluxe-logo-192.png" 
                alt="ParkLuxe Logo" 
                className="w-8 h-8"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>Park-Luxe</h1>
              <p className="text-sm" style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>Valet Management</p>
            </div>
          </div>

          {/* Welcome Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#dae2fd', fontFamily: 'Manrope, sans-serif' }}>Welcome Back</h2>
            <p style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}>Sign in to your account to continue</p>
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
            <Tabs.List
              className="grid grid-cols-3 gap-2 p-1 rounded-[0.375rem]"
              style={{ background: '#171f33' }}
            >
              {roleLabels.map((label, index) => (
                <Tabs.Trigger
                  key={roles[index]}
                  value={roles[index]}
                  className="px-4 py-2 text-sm font-medium rounded-[0.375rem] transition-all"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    background: selectedTab === index
                      ? '#8b5cf6'
                      : 'transparent',
                    color: selectedTab === index ? '#00354a' : '#909097',
                    boxShadow: selectedTab === index ? '0 4px 12px rgba(139,92,246,0.2)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (selectedTab !== index) {
                      e.currentTarget.style.color = '#dae2fd';
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedTab !== index) {
                      e.currentTarget.style.color = '#909097';
                    }
                  }}
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
                className="p-4 mb-4 rounded-[0.375rem]"
                style={{
                  background: 'rgba(147,0,10,0.35)',
                  borderLeft: '4px solid #ffb4ab',
                }}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ffb4ab' }} />
                  <p className="text-sm" style={{ color: '#ffdad6', fontFamily: 'Inter, sans-serif' }}>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
              className="mt-6 text-center text-sm"
              style={{ color: '#909097', fontFamily: 'Inter, sans-serif' }}
            >
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium transition-colors"
                style={{ color: '#8b5cf6' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#c4e7ff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8b5cf6')}
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
