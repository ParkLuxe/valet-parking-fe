/**
 * Redux slice for authentication state management
 * Manages user authentication, login, logout, and token storage
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  STORAGE_KEYS  } from '../../utils';
import type { User, AuthResponse } from '../../types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state with data from local storage if available
let storedUser: User | null = null;
try {
  const raw = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  storedUser = raw ? JSON.parse(raw) : null;
  // Normalize legacy `role` -> `roleName` when loading from storage
  if (storedUser && (storedUser as any).role && !(storedUser as any).roleName) {
    (storedUser as any).roleName = (storedUser as any).role?.name ?? (storedUser as any).role;
    delete (storedUser as any).role;
  }
} catch (e) {
  storedUser = null;
}

const initialState: AuthState = {
  user: storedUser,
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null,
  refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      // Extract only tokens from login response
      // Support both accessToken and token field for backward compatibility
      const accessToken = action.payload.accessToken ?? action.payload.token ?? '';
      const { refreshToken } = action.payload;
      
      state.token = accessToken;
      state.refreshToken = refreshToken || null;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // Store tokens
      if (accessToken) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      }
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
    },
    
    setUserData: (state, action: PayloadAction<User>) => {
      const userData = { ...action.payload } as any;

      // Normalize legacy `role` field (object or string) to `roleName`
      if (userData.role && typeof userData.role === 'object') {
        const roleObj = userData.role as any;
        if (roleObj.name) {
          userData.roleName = roleObj.name;
        }
      } else if (userData.role && typeof userData.role === 'string') {
        userData.roleName = userData.role;
      }

      // Remove legacy `role` to avoid ambiguity
      if (userData.role) {
        delete userData.role;
      }

      state.user = userData as User;
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    },
    
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
    
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
      }
    },
    
    updateToken: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
      const { accessToken, refreshToken } = action.payload;
      state.token = accessToken;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  updateToken,
  clearError,
  setUserData,
} = authSlice.actions;

export default authSlice.reducer;
